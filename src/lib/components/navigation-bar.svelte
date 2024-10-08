<script lang="ts">
  import { page } from '$app/stores';
  import { Sun, Moon } from 'lucide-svelte';

  const links = [
    {
      name: 'map',
      href: '/'
    },
    {
      name: 'add new place',
      mobile: 'create',
      href: '/form/create-place'
    },
    {
      name: 'contact',
      href: '/contact'
    }
  ];

  let activeTheme = $state('dark');

  $effect(() => {
    const currentTheme = document
      .getElementsByTagName('html')?.[0]
      ?.getAttribute('data-theme');

    if (currentTheme && ['light', 'dark'].includes(currentTheme)) {
      activeTheme = currentTheme;
    }
  });

  function changeActive() {
    if (activeTheme === 'dark') {
      activeTheme = 'light';
    } else {
      activeTheme = 'dark';
    }

    document
      .getElementsByTagName('html')?.[0]
      ?.setAttribute('data-theme', activeTheme);
  }
</script>

<div
  class="mx-auto mt-4 flex max-w-4xl items-center justify-end gap-2 px-8 py-4">
  {#each links as item}
    <div>
      <a
        href={item.href}
        class="{$page.url.pathname === item.href
          ? 'font-bold underline'
          : ''} mr-3 md:mr-0">
        {#if !item.mobile}
          {item.name}
        {:else}
          <span class="md:hidden">{item.mobile}</span>
          <span class="hidden md:block">{item.name}</span>
        {/if}
      </a>
    </div>

    <div class="divider divider-horizontal hidden md:flex"></div>
  {/each}

  <label class="swap swap-rotate" for="theme-change-checkbox">
    <!-- this hidden checkbox controls the state -->
    <input
      id="theme-change-checkbox"
      type="checkbox"
      class="theme-controller"
      value="synthwave"
      onchange={changeActive} />

    <Sun class="swap-on h-5 w-5" />
    <Moon class="swap-off h-5 w-5" />
  </label>
</div>
