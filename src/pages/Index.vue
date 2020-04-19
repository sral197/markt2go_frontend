<template>
  <q-page class="flex">
    <div>
      <doc-header>
        Schön, dass Du Dich für Markt2Go interessierst...
      </doc-header>
      <q-banner
        inline-actions
        rounded
        class="bg-grey-1 q-ma-md"
        style="border: 1px solid rgba(0, 0, 0, 0.12)">
        <div class="gt-xs">
          Hier geht es direkt zu den Wochenmärkten...
        </div>
        <template v-slot:action>
          <q-btn
            flat icon="storefront"
            label="Zu den Wochenmärkten"
            color="primary"
            @click="$router.push('/market')" />
        </template>
      </q-banner>
      <div class="text-body1 row q-pa-md">
        <div class="q-pa-xs col-12 col-sm-6 ">
          ...wir sind Manon, Steffen, Nico, Sebastian und Lars und haben
          in den letzten Wochen eine Plattform geschaffen, die einen risikoarmen Einkauf frischer,
          gesunder und regionaler Produkte auf den Wochenmärkten während der Covid-19 Krise ermöglichen soll.
        </div>
        <q-img
          class="col-12 col-sm-6 q-mb-md"
          src="/statics/fruits.jpg"
        />
        <h2 class="q-ma-none">Wie funktioniert Markt2Go?</h2>
        <div class="q-pa-xs q-pb-md">
          Du als Kunde kannst über das Internetportal Deinen Einkauf online bei den Händlern anfragen
          und sie am Markttag zur festgelegten Uhrzeit am Stand abholen. So musst Du Dich nur kurz auf dem Wochenmarkt aufhalten. Stoßzeiten und lange Warteschlangen können
          reduziert werden  und das Ansteckungsrisiko wird minimiert. Trotzdem kannst Du wie gewohnt frische,
          gesunde und regionale Produkte kaufen und unterstützt dabei unsere örtliche Wirtschaft.
        </div>

        <div class="q-pa-xs">
          Unsere Platform hat das Ziel während der Covid-19 Krise zu unterstützen.
          Wir verfolgen keine kommerziellen Absichten. Die Registrierung und Nutzung ist sowohl
          für Dich als Kunde als auch für die Markstände kostenlos. Das Portal ist in unserer
          Freizeit entstanden und wird von uns aktuell privat finanziert.
        </div>
        <div class="col-12 q-pb-md" align="right">
          <q-btn
            flat icon="movie"
            label="Video"
            color="primary"
            @click="showVideo = true" />
        </div>
        <h2 class="q-ma-none">Was passiert mit meinen Daten?</h2>
        <div class="q-pa-xs q-pb-md">
          Datenschutz ist uns sehr wichtig. Zur Registrierung ist lediglich Deine E-Mailadresse erforderlich. Wenn Du eine Anfrage an einen Marktstand sendest, so benötigen wir zusätzlich Deinen
          Namen und Deine Telefonnummer. Die Marktstandbetreiber haben sich verpflichtet diese Daten ausschließlich zur Abwicklung deiner Anfrage zu nutzen und im Anschluss an den Markttag zu löschen. Die Daten sind erforderlich, damit der Händler Dich bei Rückfragen zu Deinem Warenkorb
          telefonisch kontaktieren kann sowie Deine Anfragen am Markttag zuordnen zu können. Wir löschen am Ende des Markttages alle zugehörigen Anfragen (inkl. Telefonnummer und Name) aus unserer Datenbank.
          Dein Profil kannst du selbstverständlich ebenfalls jederzeit löschen.
        </div>
          <h2 class="q-ma-none">Kontakt</h2>
          <div class="q-pa-xs q-pb-md">
          Wenn Du Fragen hast oder als Händler eines Wochenmarktes unsere Platform nutzen möchtest,
          sende uns doch einfach eine E-Mail an Info@Markt2Go.de.
        </div>
        <div class="col-12" align="right">
          <q-btn
            flat icon="mail"
            label="E-Mail"
            color="primary"
            @click="sentMail" />
        </div>
        <div class="q-pa-xs q-pt-md">
          <i>Dein Markt2Go-Team: Manon, Steffen, Nico, Sebastian und Lars</i>
        </div>
      </div>
      <q-dialog v-model="showVideo">
          <q-card style="width:800px">
            <q-card-section >
              <div class="q-pa-md ">
                <q-video
                  :ratio="16/9"
                  src="https://www.youtube.com/embed/ZjhvM1Ua8Ck?rel=0"
                />
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<style scoped>
.carouselMod >>> .q-carousel__slide {
  background-size: 100% auto !important;
  background-repeat: no-repeat;
}
</style>
<script>
import { openURL } from 'quasar'
export default {
  name: 'PageLanding',
  data: function () {
    return {
      showVideo: false
    }
  },
  methods: {
    sentMail: function () {
      openURL('mailto:info@markt2go.de')
    }
  }
}
</script>
