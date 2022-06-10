const UserService = require('../services/user.service');
const RoleService = require('../services/role.service');
const jwt = require('jsonwebtoken');
const { crypto_encrypt, crypto_decrypt } = require('../helpers/encryption_helper');
const { successResp, errorResp, serverError } = require('../helpers/error_helper');
const { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE, ROLES, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, JWT_KEY, VERIFY_REGISTER_EMAIL_TEMPLATE, FORGOT_PASSWORD_EMAIL_TEMPLATE, CLIENT_HOST, EMAIL_TYPES } = require('../lib/constants');

// creating super admin 
exports.createSuperAdmin = async (req, res) => {
  try {
    const role = await RoleService.getRoleByRoleId(ROLES.SUPER_ADMIN);
    const superAdmin = await UserService.getUserByRoleId(role._id);
    if (!superAdmin.length) {
      const adminData = {
        role,
        fullName: role.name,
        email: SUPER_ADMIN_EMAIL,
        password: crypto_encrypt(SUPER_ADMIN_PASSWORD),
        isVerified: true,
        canLogin: true,
      };
      const createdSuperAdmin = await UserService.register(adminData);
      if (createdSuperAdmin) {
        return successResp(res, { msg: SUCCESS_MESSAGE.SUPER_ADMIN_CREATED, code: HTTP_STATUS.SUCCESS.CODE })
      } else {
        return errorResp(res, { msg: ERROR_MESSAGE.SUPER_ADMIN_FAILED, code: HTTP_STATUS.BAD_REQUEST.CODE })
      }
    } else {
      return errorResp(res, { msg: ERROR_MESSAGE.SUPER_ADMIN_EXIST, code: HTTP_STATUS.BAD_REQUEST.CODE })
    }
  } catch (error) {
    serverError(res, error);
  }
}

// register admin user
exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  req.body.password = crypto_encrypt(password);
  try {
    await UserService.getUserByEmail(email).then(async (user) => {
      if (user) {
        if (user.isVerified) {
          return errorResp(res, { msg: ERROR_MESSAGE.ALLREADY_REGISTERED, code: HTTP_STATUS.BAD_REQUEST.CODE })
        } else {
          tokenVerificationEmail(EMAIL_TYPES.VERIFY_REGISTER, user, res);
        }
      } else {
        const role = await RoleService.getRoleByRoleId(ROLES.ADMIN);
        await UserService.register({ ...req.body, role }).then((result) => {
          tokenVerificationEmail(EMAIL_TYPES.VERIFY_REGISTER, result, res);
        }).catch((error) => {
          serverError(res, error)
        });
      }
    }).catch((error) => {
      serverError(res, error)
    });
  } catch (error) {
    serverError(res, error);
  }
};

// generic email for register and forgot password
const tokenVerificationEmail = async (type, user, res) => {
  user.token = crypto_encrypt(`${Math.floor(1000 + Math.random() * 9000)}`);
  const tokenExpiry = Date.now() + 3600000;
  user.html = getEmailTemplate({ type, token:  user.token });
  console.log(user);
  await UserService.tokenVerificationEmail(user).then(async (result) => {
    if (!result) {
      return errorResp(res, { msg: ERROR_MESSAGE.EMAIL_SENT_FAILED, code: HTTP_STATUS.BAD_REQUEST.CODE })
    }
    await UserService.updateUserById(user._id, { token: user.token, tokenExpiry });
    return successResp(res, { msg: SUCCESS_MESSAGE.EMAIL_SENT, code: HTTP_STATUS.SUCCESS.CODE })
  }).catch((error) => {
    serverError(res, error)
  });
}

// email templates
const getEmailTemplate = (obj) => {
  switch (obj.type) {
    case EMAIL_TYPES.VERIFY_REGISTER:
      return VERIFY_REGISTER_EMAIL_TEMPLATE({token: obj.token})
      break;
      case EMAIL_TYPES.FORGOT_PASSWORD :
        const link = `${CLIENT_HOST}/auth/new-password/${obj.token}`;
        return FORGOT_PASSWORD_EMAIL_TEMPLATE({link})
      break;
  }
}

// verify register token
exports.verifyToken = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    await UserService.getUserById(userId).then(async (user) => {
      const { token, tokenExpiry } = user;
      if (tokenExpiry < Date.now()) {
        return errorResp(res, { msg: ERROR_MESSAGE.TOKEN_EXPIRED, code: HTTP_STATUS.BAD_REQUEST.CODE });
      }
      if (otp !== crypto_decrypt(token)) {
        return errorResp(res, { msg: ERROR_MESSAGE.INVALID_TOKEN, code: HTTP_STATUS.BAD_REQUEST.CODE })
      }
      await UserService.updateUserById(userId, { isVerified: true, token: "", tokenExpiry: null }).then(() => {
        return successResp(res, { msg: SUCCESS_MESSAGE.ACTIVATION_MAIL_VERIFIED, code: HTTP_STATUS.SUCCESS.CODE })
      })

    }).catch((error) => {
      errorResp(res, { msg: ERROR_MESSAGE.NOT_FOUND, code: HTTP_STATUS.NOT_FOUND.CODE })
    });
  } catch (error) {
    serverError(res, error)
  }
};

// login user
exports.login = async (req, res) => {
  try {
    await UserService.login(req.body).then((user) => {
      if (!user) {
        return errorResp(res, { msg: ERROR_MESSAGE.INVALID_CREDS, code: HTTP_STATUS.BAD_REQUEST.CODE })
      }
      if (req.body.password !== crypto_decrypt(user.password)) {
        return errorResp(res, { msg: ERROR_MESSAGE.INVALID_CREDS, code: HTTP_STATUS.BAD_REQUEST.CODE })
      }
      const token = jwt.sign({ _id: user._id, email: user.email }, JWT_KEY, {
        expiresIn: '2h',
      });
      const userData = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        canLogin: user.canLogin,
        status: user.status,
        token: token,
      };
      return successResp(res, { msg: SUCCESS_MESSAGE.LOGIN_SUCCESS, code: HTTP_STATUS.SUCCESS.CODE, data: userData })
    }).catch((error) => {
      errorResp(res, { msg: ERROR_MESSAGE.NOT_FOUND, code: HTTP_STATUS.NOT_FOUND.CODE })
    });
  } catch (error) {
    serverError(res, error)
  }
};

// forgot user password
exports.forgetPassword = async (req, res) => {
  try {
    await UserService.getUserByEmail(req.body.email).then(async (user) => {
      if (!user) {
        return errorResp(res, { msg: ERROR_MESSAGE.INVALID_EMAIL, code: HTTP_STATUS.BAD_REQUEST.CODE })
      } else {
        tokenVerificationEmail(EMAIL_TYPES.FORGOT_PASSWORD, user, res);
      }
    }).catch((error) => {
      return errorResp(res, { msg: ERROR_MESSAGE.NOT_FOUND, code: HTTP_STATUS.NOT_FOUND.CODE })
    })
  } catch (error) {
    serverError(res, error)
  }
};

// reset user password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    await UserService.getUserByToken(token).then(async (user) => {
      const { tokenExpiry } = user;
      if (tokenExpiry < Date.now()) {
        return errorResp(res, { msg: ERROR_MESSAGE.TOKEN_EXPIRED, code: HTTP_STATUS.BAD_REQUEST.CODE });
      }
      const password = crypto_encrypt(newPassword);
      await UserService.updateUserById(user._id, { password, token: "", tokenExpiry: null }).then(() => {
        return successResp(res, { msg: SUCCESS_MESSAGE.PASSWORD_RESET_SUCCESS, code: HTTP_STATUS.SUCCESS.CODE })
      })
    }).catch((error) => {
      errorResp(res, { msg: ERROR_MESSAGE.NOT_FOUND, code: HTTP_STATUS.NOT_FOUND.CODE })
    });
  } catch (error) {
    serverError(res, error)
  }
};
