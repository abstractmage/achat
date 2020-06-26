import React from 'react';
import Router from 'next/router';

import Modal from '~/components/modal';


interface ProfileSignUpProps {
  show: boolean;
}

function ProfileSignUp(props: ProfileSignUpProps) {
  const { show } = props;

  return (
    <Modal show={show} onClose={() => Router.push('/', '/', { shallow: true })} container={null}>
    </Modal>
  );
}


export default ProfileSignUp;
