<template>
  <q-page class="flex">
    <div class="full-width">
      <doc-header
        caption=""
        icon="error"
        >
        Es ist ein Fehler aufgetreten...
      </doc-header>
      <div>
        Dies hätte nicht passieren sollen. Bitte versuche es noch einmal oder schreibe uns eine
        <a href="mailto:info@markt2go.de">E-Mail</a>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Error'
}
</script>
