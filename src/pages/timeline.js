import Input from '../components/input.js';
import List from '../components/list-menu.js';
import Button from '../components/button.js';
import Post from '../components/post.js';
import Textarea from '../components/textarea.js';
import Bio from '../components/bio.js';
import Select from '../components/select.js';

const signOut = () => firebase.auth().signOut();

const goProfile = () => {
  window.location = '#profile';
};

const createPost = () => {
  const textInput = document.querySelector('.post-text').value;
  const selectPrivacy = document.querySelector('.slc-privacy').value;
  const imagePost = document.querySelector('.post-image').files[0];
  if (textInput === '') {
    alert('Campo Vazio! Digite sua mensagem');
  } else if (!imagePost) {
    firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((userSnap) => {
        firebase.firestore().collection('posts').add({
          text: textInput,
          userId: firebase.auth().currentUser.uid,
          addedAt: new Date().toLocaleString('pt-BR'),
          likes: [],
          privacy: selectPrivacy,
          user: userSnap.data() || null,
        })
          .then(() => {
            textInput.value = '';
          });
      });
  } else {
    firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((userSnap) => {
        firebase.storage().ref().child(`/images_post/${imagePost.name}`).put(imagePost)
          .then(() => {
            firebase.storage().ref().child(`/images_post/${imagePost.name}`).getDownloadURL()
              .then((url) => {
                firebase.firestore().collection('posts').add({
                  text: textInput,
                  userId: firebase.auth().currentUser.uid,
                  addedAt: new Date().toLocaleString('pt-BR'),
                  likes: [],
                  privacy: selectPrivacy,
                  user: userSnap.data() || null,
                  imagePost: url,
                })
                  .then(() => {
                    textInput.value = '';
                  });
              });
          });
      });
  }
};

const deletePost = (event) => {
  const id = event.target.dataset.id;
  firebase.firestore().collection('posts').doc(id).delete();
};

const enableField = (event) => {
  const id = event.target.dataset.id;
  document.querySelector(`[data-id=text-${id}]`).contentEditable = 'true';
  document.querySelector(`[data-id=text-${id}]`).className = 'publication publicationContentEditable';
};

const updatePost = (event) => {
  const id = event.target.dataset.id;
  const editedPost = document.querySelector(`[data-id=text-${id}]`).textContent;
  const editedSelect = document.querySelector(`[data-id=privacy-${id}]`).value;
  firebase.firestore().collection('posts').doc(id).update({ text: editedPost, privacy: editedSelect, addedAt: new Date().toLocaleString('pt-BR') });
};


const liked = (event) => {
  const id = event.target.dataset.id;
  firebase.firestore().collection('posts')
    .doc(id)
    .get()
    .then((snap) => {
      const post = snap.data();
      const index = post.likes.indexOf(firebase.auth().currentUser.uid);
      if (index >= 0) {
        post.likes.splice(index, 1);
      } else {
        post.likes.push(firebase.auth().currentUser.uid);
      }
      firebase.firestore().collection('posts').doc(id).update({ likes: post.likes });
    });
};

const timeline = (props) => {
  let layout = '';
  props.posts.forEach((snap) => {
    const post = snap.data();
    if (post.userId === firebase.auth().currentUser.uid || post.privacy === '🔓') {
      layout += Post({
        id: snap.id,
        post,
        deleteEvent: deletePost,
        updateEvent: updatePost,
        enableEvent: enableField,
        likesEvent: liked,
      });
    }
  });

  const templateTimeLine = `
  <header class="header-menu">
    ${Input({
    class: 'navigation',
    id: 'navigation',
    type: 'checkbox',
  })}
    <label for="navigation">&#9776;</label>
    <nav class="menu">
      <ul>
        ${List({
    class: 'profile',
    title: 'Perfil',
    onClick: goProfile,
  })}
        ${List({
    class: 'out',
    title: 'Sair',
    onClick: signOut,
  })}
      </ul>
    </nav>
  </header>
  <h1 class="title-timeline">Low Carb Style</h1>  
  ${Bio(props.user || {})}
  <form>
    <div class="container-publish">
      <div class="textarea-publish">
    ${Textarea({
    class: 'post-text',
    id: 'post-text',
    placeholder: 'digite aqui...',
  })}
    </div>
    <div class="images-publish">
    <label class="far fa-image label-image-post" for="post-image"></label>
    ${Input({
    class: 'far fa-image post-image',
    id: 'post-image',
    type: 'file',
  })}
    ${Select({
    class: 'slc-privacy',
    selected: '🔓',
    options: [{ value: '🔓', text: 'Público 🔓' }, { value: '🔐', text: 'Privado 🔐' }],
  })}
    ${Button({
    class: 'btn-publicar',
    id: 'btn-publicar',
    type: 'submit',
    title: 'Publicar',
    onClick: createPost,
  })}
    </div> 
    </div>
    <div class="posts">
      ${layout}
    </div>
  </form>
  `;

  return templateTimeLine;
};

export default timeline;
