import { upload } from './upload';
import './styles/styles.scss';

upload('#choose-files', {
  multiple: true,
  accept:   ['.jpg', '.jpeg', '.png', '.gif'],
  onUpload: (files) => {
    console.log(files);
  },
});