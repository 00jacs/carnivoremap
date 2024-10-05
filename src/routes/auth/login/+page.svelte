<script lang="ts">
  import { MoveLeft } from 'lucide-svelte';
</script>

<div class="mx-auto max-w-4xl py-12">
  <h1 class="mb-2 text-3xl font-bold">Working on it...</h1>

  <p class="mb-2">
    We are currently working on the authentication part of the application as
    well as profile creation, point collection, public forum, and other
    features.
  </p>

  <p class="mb-4">Please stay tuned for more updates.</p>

  <button class="btn btn-outline" onclick={() => window.history.go(-1)}>
    <MoveLeft class="h-4 w-4" />
    Go back
  </button>
</div>
