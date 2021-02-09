import firebase   from 'firebase/app';
import { upload } from './upload';
import 'firebase/storage';

import './styles/styles.scss';

const firebaseConfig = {
  apiKey:            'AIzaSyDv6xe5Ik3c0VmEIOJgblgOYdlpA4OFEFM',
  authDomain:        'file-loader-da3e3.firebaseapp.com',
  projectId:         'file-loader-da3e3',
  storageBucket:     'file-loader-da3e3.appspot.com',
  messagingSenderId: '674758997065',
  appId:             '1:674758997065:web:109c49bae8668510477b98',
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const handleUpload = (files, blocks) => {
  files.forEach((file, index) => {
    const ref  = storage.ref(`images/${file.name}`);
    const task = ref.put(file);

    task.on(
      'state_changed',
      snapshot => {
        const status      = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        const block       = blocks[index].querySelector('.preview-info-progress');
        block.style.width = `${status}%`
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('complete');
      },
    );
  });
};

upload('#choose-files', {
  multiple: true,
  accept:   ['.jpg', '.jpeg', '.png', '.gif'],
  onUpload: handleUpload,
});