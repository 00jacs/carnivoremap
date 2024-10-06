<script lang="ts">
  import { PUBLIC_EMAIL_ADDRESS } from '$env/static/public';
</script>

<div class="mx-auto max-w-4xl px-8 py-12">
  <h1 class="mb-4 text-3xl font-bold">Contact us!</h1>

  <p class="mb-6">
    Please feel free to get in touch if you have any <span class="font-bold">
      suggestions on how we can improve
    </span>
    our website or
    <span class="font-bold">if you have ANY feedback.</span>
    We would really love to hear from you!
    <br />
    <br />
    It would not exist without you and your contributions, so thank you! The app
    is fully crowdsource and depends on the good will of people who share their experiences.
  </p>

  <a href="mailto:{PUBLIC_EMAIL_ADDRESS}">
    <span class="font-bold">Our email:</span>
    <span class="italic underline">
      {PUBLIC_EMAIL_ADDRESS}
    </span>
  </a>
</div>
