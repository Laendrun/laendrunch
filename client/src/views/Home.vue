<template>
  <section>
    <div class="home text-center pt-3">
      <h1>Laendrun</h1>
      <h3>Services informatiques par Laendrun</h3>
    </div>



    <br />
    <div class="services pt-3 text-left">
      <h4>Services</h4>
      <hr>
      <p>Votre ordinateur ne s'allume plus, 
      il devient vieux ou lent et vous n'avez pas envie d'en acheter un nouveau ?</p>
      <p>Contactez nous par email à contact@laendrun.ch et nous vous 
      proposerons une solution adaptée à vos besoin 😉.</p>
      <hr>
      <p>Voici les différents services que je propose : </p>
      <ul>
        <li> Mise à niveau de votre ordinateur</li>
        <li> Réparation diverses (remplacement de la batterie, changement de disque dur, etc)</li>
        <li> Création de site internet</li>
        <li> Montage d'un ordinateur fixe sur mesure</li>
      </ul>
      <p>N'hésitez pas à me contacter si ce dont vous avez besoin ne fait pas partie de cette liste ou si vous avez envie de plus d'informations sur un service en particulier.</p>
    </div>



    <br />
    <div class="informations pt-3 text-left">
      <h4>Informations générales</h4>
      <hr>
      <p>Tous les devis que je propose sont gratuits et n'engagent à rien.</p>
      <p>Afin de vous fournir un devis avec des prix au plus proches de la réalité, merci de nous fournir le plus d'informations possible sur votre ordinateur.</p>
      <p>Aussi, si vous voulez que je crée votre site internet, merci de bien réfléchir à ce que vous voulez et comment vous le voulez afin que je puisse le réaliser au plus vite.</p>
      <p>Si vos demandes / besoins ne sont pas proposées sur le site directement, merci de vous référer à la section Contact au bas de la page.</p>
      <p>Les prix de bases sont indiqués en-dessous des différentes interventions.</p>
    </div>



    <br />
    <div class="upgrade-computer pt-3 text-left">
      <h4>Mise à niveau de votre ordinateur</h4>
      <hr>
      <p>Qu'est-ce que j'entends par mise à niveau de votre ordinateur ?</p>
      <p>Voici une liste de certaines choses qui entrent dans la mise à niveau :</p>
      <ul>
        <li> Mise à jour de votre ordinateur vers Windows 10</li>
        <li> Augmentation de la mémoire vive (RAM) de votre ordinateur</li>
        <li> Augementation de la taille de votre disque dur (remplacement du disque, ajout d'un disque)</li>
        <li> Changement d'un disque dur vers un disque SSD</li>
        <li>...</li>
      </ul>
      <br />
      <h5>Prix</h5>
      <ul>
        <li> Mise à jour vers Windows 10 : CHF15 / 15 minutes + prix de la licence</li>
          <ul>
            <li> License Windows 10 Famille, CHF160</li>
            <li> Licence Windows 10 Professionnel, CHF280</li>
          </ul>
        <li> Augementation de la mémoire vive : CHF15 + prix des barrettes de mémmoire</li>
        <li> Augmentation de la taille du disque dur / SSD : CHF30 + prix du disque dur / SSD</li>
        <li> Changement d'un disque dur vers un SSD : CHF30 + prix du SSD</li>
      </ul>
    </div>


    
    <br />
    <div class="reaparations pt-3 text-left">
      <h4>Réparations diverses</h4>
      <hr>
      <p>Voici les différentes réparations que je propose :</p>
      <ul>
        <li> Changement du disque dur / SSD. Si votre disque dur / SSD n'est plus détecté ou autre problème. <strong>Nous ne garantissons pas la récupération des données.</strong></li>
        <li> Changement de la batterie de votre ordinateur portable (si le modèle le permet)</li>
        <li> Remplacement des différents composants de votre ordinateur fixe (alimentation, carte mère, carte graphique, etc)</li>
        <li>...</li>
      </ul>
      <br />
      <h5>Prix</h5>
      <ul>
        <li> Changement de carte mère ou des différentes cartes filles (graphique, son, réseau, etc) : CHF50 + prix de la carte</li>
        <li> Changement de la mémoire vive (RAM) : CHF15 + prix des barrettes</li>
        <li> Changement des autres composants : CHF30 + prix du composant</li>
      </ul>
    </div>



    <br />
    <div class="creation-site pt-3 text-left">
      <h4>Création de site internet</h4>
      <hr>
      <p>La plupart des personnes qui proposent la création de sites internet demandent un nombre de page minimum pour la création du site. Mon nombre minimum de pas est 1 😉.</p>
      <p>Chacun des sites que je crée est créé de 0, sans modèle. De cette manière, votre site sera entièrement personnalisé selon vos demandes.</p>
      <p>Afin de créer un site qui correspond parfaitement à vos besoins, je vous propose de prendre rendez-vous avec moi pour que nous puissions discuter exactement de ce que vous voulez. (Rendez-vous en visioconférence / conférence téléphonique possible en ces temps compliqués).</p>
      <p>Si vous le souhaiter, nous pouvons aussi nous occuper de l'hébergement de votre site, ainsi que de la gestion de votre nom de domaine.</p>
      <p>Pour ce service, les prix peuvent changer très rapidement en fonction de vos demandes, je ne vous donne donc pas de prix ici, merci de me contacter en vous référant à la section Contact en bas de page.</p>
    </div>



    <br />
    <div class="montage pt-3 text-left">
      <h4>Montage d'un ordinateur fixe</h4>
      <hr>
      <p>Vous désirez monter un ordinateur fixe sur mesure mais vous ne savez pas comment faire ?</p>
      <p>Contactez moi et je le ferai pour vous ! Je m'occupe de tout, que vous ayez déjà les composants nécessaires ou non !</p>
      <br />
      <h5>Prix</h5>
      <ul>
        <li> CHF50 / heures + prix des composants</li>
      </ul>
    </div>



    <br />
    <hr>
    <div class="contact pt-3 pb-5 mb-5 text-left">
      <div v-if="loading">
        <img src="../assets/infinity.svg" />
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <div class="alert alert-success" role="alert" v-if="successMessage">
        {{ successMessage }}
      </div>
      <form @submit.prevent="send">
        <fieldset>
          <legend>Contact</legend>
          <div class="form-group">
            <label for="from">Addresse email</label>
            <input 
            v-model="email.from"
            type="email" 
            class="form-control" 
            id="from" 
            aria-describedby="emailHelp" 
            placeholder="Addresse email"
            required>
            <small 
            id="emailHelp" 
            class="form-text text-muted">Merci d'entrer une addresse email valide.</small>
          </div>
          <div class="form-group">
            <label for="fromName">Nom</label>
            <input 
            v-model="email.fromName"
            type="text" 
            class="form-control" 
            id="fromName" 
            aria-describedby="nameHelp" 
            placeholder="Nom"
            required>
            <small 
            id="nameHelp" 
            class="form-text text-muted">Merci d'entrer votre nom.</small>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
            v-model="email.message"
            class="form-control" 
            id="message" 
            required></textarea>
          </div>
          <button 
          type="submit" 
          class="btn btn-primary">Envoyer</button>
        </fieldset>
      </form>
    </div>
  </section>
</template>

<script>
import Joi from '@hapi/joi';
const SENDMAIL_URL = 'http://api.laendrun.ch/email/send';
const SAVEMAIL_URL = 'http://api.laendrun.ch/email/save';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjI0LCJ1c2VybmFtZSI6InN5cyIsImVtYWlsIjoiYWVieTI4MUBnbWFpbC5jb20iLCJpYXQiOjE1OTIwODg3NzMsImV4cCI6MTU5MjE3NTE3M30.wcE1D0L6ux6HWm2R-DOa6VzBFP10i2DRwTwCDC3kxYw';

const schema  = Joi.object({
  from: Joi.string().email({ tlds: { allow: false } }).required(),
  fromName: Joi.string().trim().min(2).required(),
  message: Joi.string().trim().min(10).required(),
})

export default {
  // 
  data: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
    email: {
      from: '',
      fromName: '',
      message: '',
    },
  }),
  watch: {
    email: {
      handler() {
        this.erroMessage = '';
        this.successMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    send() {
      this.successMessage = '';
      this.errorMessage = '';
      if(this.validEmail()){
        const body = {
          from: this.email.from,
          fromName: this.email.fromName,
          message: this.email.message,
          subject: `${this.email.fromName} vous a envoyé un message`,
          to: 'contact@laendrun.ch',
        }
        this.loading = true;
        fetch(SENDMAIL_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': TOKEN,
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          response.json()
            .then((error) => {
              throw new Error(error.message);
            })
            .catch((error) => {
              this.errorMessage = error;
            });
        }).then((email) => {
          this.loading = false;
          if (email) {
            this.successMessage = 'Email envoyé';
          }
        }).catch((error) => {
          this.loading = false;
          this.errorMessage = error.message;
        });
      }
    },
    validEmail() {
      const result = schema.validate(this.email);
      if (!result.error) {
        return true;
      }

      if (result.error.message.includes('fromName')) {
        this.errorMessage = 'Nom invalide 😭';
      } else if (result.error.message.includes('from')) {
        this.errorMessage = 'Adresse email invalide 😭';
      } else if (result.error.message.includes('message')) {
        this.errorMessage = 'Message invalide 😭';
      }
      return false;
    }
  }
}
</script>


  // data: () => ({
  //   loading: false,
  //   errorMessage: '',
  //   email: {
  //     email: '',
  //     fromName: '',
  //     message: '',
  //     subject: `${fromName} vous a envoyé un message`,
  //     to: 'contact@laendrun.ch',
  //   }
  // }),
  // methods: {
  //   send() {
  //     this.erroMessage = '';
  //     console.log('SENT');
  //     this.erroMessage = 'SENT';
  //   }
  // },