import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  List,
  Header,
  Button,
  Message,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import {
  fetchMemberList,
  teamMembersSelector,
  addMemberOpportunity,
  removeMemberOpportunity,
} from '../../../features/team/teamParticipantsSlice';
const style = { fontSize: 13 };
const ManageParticipants = ({
  viewParticipant,
  setViewParticipant,
  opportunity,
}) => {
  const dispatch = useDispatch();
  // fetch data from our store
  const { loading, error, members } = useSelector(teamMembersSelector);
  useEffect(() => {
    dispatch(fetchMemberList());
  }, []);

  return (
    <Modal
      onClose={() => setViewParticipant(false)}
      onOpen={() => setViewParticipant(true)}
      open={viewParticipant}
      dimmer='blurring'
      size='tiny'
    >
      <Modal.Header>
        {opportunity.participants.length > 0
          ? 'Manage Participants'
          : 'Add Participants'}
        <p className='mt-1' style={style}>
          Participants will be notified of opportunity via e-mail once it's
          published.
        </p>
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          {error && (
            <Message color='red' className='error-message mb-3'>
              {error}
            </Message>
          )}
          {loading && (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          )}
          {!loading &&
            members.map((member) => (
              <List divided verticalAlign='middle' key={member._id}>
                <List.Item>
                  {opportunity.participants.includes(member._id) ? (
                    <List.Content floated='right'>
                      <Button
                        onClick={() =>
                          dispatch(
                            removeMemberOpportunity(opportunity._id, member._id)
                          )
                        }
                        disabled={loading}
                        className='btn-link-danger'
                      >
                        Remove
                      </Button>
                    </List.Content>
                  ) : (
                    <List.Content floated='right'>
                      <Button
                        onClick={() =>
                          dispatch(
                            addMemberOpportunity(opportunity._id, member._id)
                          )
                        }
                        disabled={loading}
                        className='btn-link'
                      >
                        Add
                      </Button>
                    </List.Content>
                  )}

                  <List.Content>
                    <Header>
                      {`${member.firstName} ${member.lastName}`}
                      <Header.Subheader>{member.email}</Header.Subheader>
                    </Header>
                  </List.Content>
                </List.Item>
              </List>
            ))}
          {members.length === 0 && !loading && (
            <Message>No Team members available.</Message>
          )}
          <p className='mt-2'>
            If a Team Member is not in the list above, please add them first in
            the 'Team' section.
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Done'
          onClick={() => setViewParticipant(false)}
          className='btn'
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ManageParticipants;
