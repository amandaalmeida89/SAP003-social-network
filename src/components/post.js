import Button from './button.js';
import ButtonImage from './image-button.js';
import Select from './select.js';

const Post = (props) => {
  const userId = firebase.auth().currentUser.uid;
  let template = `
  <div class="container-public">
    <div class="date-public">
      <p data-id='${props.id}' class='date-post'>${props.post.addedAt.slice(0, 16)}</p> 
    </div>
    <div class="publication-public">
      <p data-id='text-${props.id}' class='publication'>${props.post.text}</p>
      <hr>
      <div class='info-like-privacy'>
      <p data-id='numbers-${props.id}' class='likes'>${props.post.likes || ''}</p>
      ${Select({
    class: 'slc-privacy-post',
    dataId: props.id,
    selected: props.post.privacy,
    options: [{ value: '🔓', text: 'Público 🔓' }, { value: '🔐', text: 'Privado 🔐' }],
  })}
      </div>
    </div>
    <div class="info-post">
    ${ButtonImage({
    class: 'like-post',
    dataId: props.id,
    type: 'image',
    src: 'images/curtir.png',
    onClick: props.likesEvent,
  })}`;

  if (userId === props.post.userId) {
    template += Button({
      class: 'edit-post',
      dataId: props.id,
      title: 'Editar',
      onClick: props.enableEvent,
    });

    template += Button({
      class: 'save-post',
      dataId: props.id,
      title: 'Salvar',
      onClick: props.updateEvent,
    });

    template += Button({
      class: 'delete-post',
      dataId: props.id,
      title: 'Deletar',
      onClick: props.deleteEvent,
    });
  }

  template += '</div></div>';

  return template;
};

export default Post;
