import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

const PublishOpportunity = ({ viewPublish, setViewPublish, onSubmittion }) => {
  return (
    <Modal
      onClose={() => setViewPublish(false)}
      onOpen={() => setViewPublish(true)}
      open={viewPublish}
      dimmer='blurring'
      size='tiny'
    >
      <Modal.Header>Publish Opportunity</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          Once the opportunity is published it cannot be edited or add any more
          participants.
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content='Cancel' onClick={() => setViewPublish(false)} />
        <Button
          content='Publish Now'
          onClick={() => {
            onSubmittion();
            setViewPublish(false);
          }}
          className='btn'
        />
      </Modal.Actions>
    </Modal>
  );
};

export default PublishOpportunity;
