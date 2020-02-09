import Button from './button.js';
import ButtonImage from './image-button.js';
import Select from './select.js';
import Paragraph from './paragraph.js';

const Post = (props) => {
  const userId = firebase.auth().currentUser.uid;
  let template = `
  <div class="container-public">
    <div class="data-date-public">
    ${Paragraph({
    class: 'name-user',
    dataId: props.id,
    text: props.post.user ? `${props.post.user.name}` : '...',
  })}
    ${Paragraph({
    class: 'date-post',
    dataId: props.id,
    text: props.post.addedAt.slice(0, 16),
  })} 
    </div>
    <div class="publication-public">
    ${Paragraph({
    class: 'publication',
    dataId: `text-${props.id}`,
    text: props.post.text,
  })} 
  </div>`;

  template += `<div class="info-post">
  <div class="info-like">
    ${ButtonImage({
    class: 'like-post',
    dataId: props.id,
    type: 'image',
    src: 'images/curtir.png',
    onClick: props.likesEvent,
  })}
    ${Paragraph({
    class: 'likes',
    dataId: `numbers-${props.id}`,
    text: props.post.likes || '',
  })} 
  </div>
  `;

  if (userId === props.post.userId) {
    template += `  
    <div class="info-change">
    ${Select({
    class: 'slc-privacy-post',
    dataId: `privacy-${props.id}`,
    selected: props.post.privacy,
    options: [{ value: '🔓', text: '🔓' }, { value: '🔐', text: '🔐' }],
  })}
    `;
    template += `  
    ${Button({
    class: 'fas fa-edit edit-post',
    dataId: props.id,
    title: '',
    onClick: props.enableEvent,
  })}  
    `;
    template += Button({
      class: 'fas fa-save save-post',
      dataId: props.id,
      title: '',
      onClick: props.updateEvent,
    });

    template += Button({
      class: 'fas fa-trash-alt delete-post',
      dataId: props.id,
      title: '',
      onClick: props.deleteEvent,
    });
  }

  template += `
  </div>
  </div>
  </div>`;

  return template;
};

export default Post;
