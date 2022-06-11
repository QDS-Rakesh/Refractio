import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Pagination,
  Table,
} from 'semantic-ui-react';
import CancelInvitation from './CancelInvitation';
import DeleteAccount from './DeleteAccount';
import InviteTeamMember from './InviteTeamMember';
import RemoveTeamMember from './RemoveTeamMember';
import ResendInvitation from './ResendInvitation';

const TeamMembers = () => {
  const [inviteTeamMember, setInviteTeamMember] = useState(false);
  const [removeTeamMember, setRemoveTeamMember] = useState(false);
  const [cancelInvitation, setCancelInvitation] = useState(false);
  const [resendInvitation, setResendInvitation] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const roles = [
    { name: 'Administrator', id: 1 },
    { name: 'Organizer', id: 2 },
    { name: 'Participant', id: 3 },
  ];

  const users = [
    {
      id: 1,
      name: 'Dominic Keller',
      email: 'd.keller@gmail.com',
      roleId: 1,
      status: 'active',
    },
    {
      id: 2,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 3,
      status: 'active',
    },
    {
      id: 3,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 2,
      status: 'active',
    },
    {
      id: 4,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 3,
      status: 'active',
    },
    {
      id: 5,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 2,
      status: 'active',
    },
    {
      id: 6,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 3,
      status: 'active',
    },
    {
      id: 7,
      name: 'Eric Butler',
      email: 'd.keller@gmail.com',
      roleId: 2,
      status: 'active',
    },
    {
      id: 8,
      name: '',
      email: 'd.keller@gmail.com',
      roleId: 2,
      status: 'pending',
    },
    {
      id: 9,
      name: '',
      email: 'd.keller@gmail.com',
      roleId: 3,
      status: 'pending',
    },
    {
      id: 10,
      name: '',
      email: 'd.keller@gmail.com',
      roleId: 2,
      status: 'pending',
    },
    {
      id: 11,
      name: '',
      email: 'd.keller@gmail.com',
      roleId: 3,
      status: 'pending',
    },
  ];

  const removeTeamMemberHandler = (id) => {
    setSelectedMember(id);
    setRemoveTeamMember(true);
  };

  const resendInvitationHandler = (id) => {
    setSelectedMember(id);
    setResendInvitation(true);
  };

  const cancelInvitationHandler = (id) => {
    setSelectedMember(id);
    setCancelInvitation(true);
  };

  // const deleteAccountHandler = (id) => {
  //   setSelectedMember(id);
  //   setDeleteAccount(true);
  // };

  return (
    <>
      <Grid>
        <Grid.Column width={8}>
          <Header as='h3' className='primary-dark-color' floated='left'>
            Team
          </Header>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button
            primary
            className='btn'
            floated='right'
            onClick={() => setInviteTeamMember(true)}
          >
            Add
          </Button>
          <InviteTeamMember
            inviteTeamMember={inviteTeamMember}
            setInviteTeamMember={setInviteTeamMember}
          />
          <RemoveTeamMember
            removeTeamMember={removeTeamMember}
            setRemoveTeamMember={setRemoveTeamMember}
            member={selectedMember}
          />
          <CancelInvitation
            cancelInvitation={cancelInvitation}
            setCancelInvitation={setCancelInvitation}
            member={selectedMember}
          />
          <ResendInvitation
            resendInvitation={resendInvitation}
            setResendInvitation={setResendInvitation}
            member={selectedMember}
          />
          <DeleteAccount
            deleteAccount={deleteAccount}
            setDeleteAccount={setDeleteAccount}
            member={selectedMember}
          />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column>
          <Table basic='very' className='table-striped'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    {user.status === 'active'
                      ? user.name
                      : 'Pending Invitation'}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      fluid
                      selection
                      defaultValue={user.roleId}
                      options={roles.map((role) => {
                        return {
                          key: role.id,
                          text: role.name,
                          value: role.id,
                        };
                      })}
                    />
                  </Table.Cell>
                  <Table.Cell className='clearfix'>
                    {user.status === 'active' ? (
                      <Button
                        className='btn-link'
                        floated='right'
                        onClick={() => removeTeamMemberHandler(user.id)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <>
                        <Button
                          className='btn-link'
                          floated='right'
                          onClick={() => resendInvitationHandler(user.id)}
                        >
                          Resend invitation
                        </Button>
                        <Button
                          className='btn-link'
                          floated='right'
                          onClick={() => cancelInvitationHandler(user.id)}
                        >
                          Cancel invitation
                        </Button>
                      </>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='4' className='clearfix'>
                  <Pagination
                    floated='right'
                    boundaryRange={0}
                    defaultActivePage={1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={2}
                    totalPages={10}
                    secondary
                    prevItem={null}
                    nextItem={null}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default TeamMembers;
