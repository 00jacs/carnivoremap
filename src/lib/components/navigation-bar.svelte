<script lang="ts">
  import { page } from '$app/stores';
  const links = [
    {
      name: 'map',
      href: '/'
    },
    {
      name: 'add new place',
      href: '/form/create-place'
    },
    {
      name: 'sign in',
      href: '/auth/login'
    }
  ];
</script>

<ul
  class="mx-auto mt-4 flex max-w-4xl items-center justify-end gap-2 px-8 py-4">
  {#each links as item, i}
    <li>
      <a
        href={item.href}
        class={$page.url.pathname === item.href ? 'font-bold underline' : ''}>
        {item.name}
      </a>
    </li>

    {#if i < links.length - 1}
      <div class="divider divider-horizontal"></div>
    {/if}
  {/each}
</ul>
