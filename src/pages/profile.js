import Input from '../components/input.js';
import List from '../components/list-menu.js';
import Button from '../components/button.js';

const goTimeline = () => {
  window.location = '#timeline';
};

const signOut = () => firebase.auth().signOut();

const updateProfile = () => {
  const nameUser = document.querySelector('.inp-name-profile').value;
  const imageUser = document.querySelector('.inp-image-profile').files[0];
  const ageUser = document.querySelector('.inp-age-profile').value;
  const professionUser = document.querySelector('.inp-profession-profile').value;
  if (!imageUser) {
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        name: nameUser,
        age: ageUser,
        profession: professionUser,
      })
      .then(() => {
        window.location = '#timeline';
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    firebase.storage().ref().child(`/images_user/${imageUser.name}`).put(imageUser)
      .then(() => {
        firebase.storage().ref().child(`/images_user/${imageUser.name}`).getDownloadURL()
          .then((url) => {
            firebase.firestore().collection('users')
              .doc(firebase.auth().currentUser.uid)
              .set({
                name: nameUser,
                age: ageUser,
                profession: professionUser,
                image: url,
              })
              .then(() => {
                firebase.firestore().collection('users')
                  .doc(firebase.auth().currentUser.uid)
                  .get()
                  .then((users) => {
                    firebase.firestore().collection('posts')
                      .where('userId', '==', firebase.auth().currentUser.uid)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.docs.forEach((doc) => {
                          firebase.firestore().collection('posts')
                            .doc(doc.id)
                            .update({
                              user: users.data(),
                            });
                        });
                      });
                  });
              });
          });
      })
      .then(() => {
        window.location = '#timeline';
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


const profile = (props) => {
  const user = props.user || {};
  const templateProfile = `
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
    class: 'timeline',
    title: 'Timeline',
    onClick: goTimeline,
  })}
      ${List({
    class: 'out',
    title: 'Sair',
    onClick: signOut,
  })}
          </ul>
        </nav>
        <h1 class="title-profile">Low Carb Style</h1>
        </header>
        <section class="section-menu">
    <p class="text-profile">Insira seus dados aqui...</p>
    <form> 
    <div class="container-form-profile">
    ${Input({
    class: 'inp-image-profile',
    id: 'inp-image-profile',
    type: 'file',
    value: user.image || '',
    placeholder: 'Link da sua imagem...',
  })}
    ${Input({
    class: 'inp-name-profile',
    id: 'inp-name-profile',
    type: 'text',
    value: user.name || '',
    placeholder: 'Seu nome...',
    maxlength: '20',
  })}
    ${Input({
    class: 'inp-age-profile',
    id: 'inp-age-profile',
    type: 'number',
    value: user.age,
    placeholder: 'Sua idade...',
  })}
    ${Input({
    class: 'inp-profession-profile',
    id: 'inp-profession-profile',
    type: 'text',
    value: user.profession || '',
    placeholder: 'Sua profissão...',
    maxlength: '20',
  })}
    ${Button({
    class: 'btn-profile',
    id: 'btn-profile',
    type: 'submit',
    title: 'Salvar Perfil',
    onClick: updateProfile,
  })}
    </div>
    </form>
    </section>
    `;
  return templateProfile;
};

export default profile;
