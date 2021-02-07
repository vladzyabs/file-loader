import './styles/upload.scss';

const bytesToSize = (bytes = 0) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const element = (tag, classes = [], textContent) => {
  const node = document.createElement(tag);
  if (classes.length) {
    node.classList.add(...classes);
  }
  if (textContent) {
    node.textContent = textContent;
  }

  return node;
};

export const upload = (selector, options = {}) => {
  let files = [];
  const {multiple = false, accept = [], onUpload} = options;
  const input = document.querySelector(selector);
  const openBtn = element('button', ['btn'], 'Open');
  const uploadBtn = element('button', ['btn'], 'Upload');
  const previewBlock = element('div', ['preview']);
  const top = element('div', ['top']);

  if (multiple) {
    input.setAttribute('multiple', true);
  }

  if (accept.length && Array.isArray(accept)) {
    input.setAttribute('accept', accept.join(','));
  }

  input.insertAdjacentElement('afterend', previewBlock);
  input.insertAdjacentElement('afterend', top);
  top.insertAdjacentElement('afterbegin', uploadBtn);
  top.insertAdjacentElement('afterbegin', openBtn);

  input.style.display = 'none';
  uploadBtn.style.display = 'none';

  const triggerClick = () => input.click();

  const changeHandler = event => {
    files = Array.from(event.target.files);

    if (!files.length) {
      return;
    }

    previewBlock.innerHTML = '';
    uploadBtn.style.display = 'block';
    top.style.marginBottom = '10px';

    Array.from(files);

    files.forEach(file => {
      if (!file.type.match('image')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        previewBlock.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src='${ev.target.result}' alt='${file.name}'/>
            <div class="preview-info">
              <span>${file.name}</span>
              <span>${bytesToSize(file.size)}</span>
            </div>
          </div>
        `);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeHandler = event => {
    if (!event.target.dataset.name) {
      return;
    }

    const {name} = event.target.dataset;

    files = files.filter(f => f.name !== name);

    if (!files.length) {
      uploadBtn.style.display = 'none';
      top.style.marginBottom = '0';
    }

    const block = previewBlock
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image');

    block.classList.add('removing-block');
    setTimeout(() => block.remove(), 300);
  };

  const clearPreview = element => {
    element.style.display = 'block';
    element.innerHTML = '<div class="preview-info-progress"></div>';
  };

  const uploadHandler = () => {
    previewBlock
      .querySelectorAll('.preview-remove')
      .forEach(el => el.remove());
    previewBlock
      .querySelectorAll('.preview-info')
      .forEach(clearPreview);
    onUpload(files);
  };

  openBtn.addEventListener('click', triggerClick);
  input.addEventListener('change', changeHandler);
  previewBlock.addEventListener('click', removeHandler);
  uploadBtn.addEventListener('click', uploadHandler);
};