<script>
  export let dependencies;
  export let setupUpdates;
  export let title = 'Sidebar';

  let items = [ 'Apples', 'Oranges', 'Pears' ];
  let filter = '';

  function addItem ( name ) {
        if ( name )   items = [ ...items, name ];
    }

  function removeItem ( idx ) {
        items = items.filter ( ( _, i ) => i !== idx );
    }

  function setFilter ( text ) {
        filter = text;
    }

  setupUpdates ({
        addItem
      , removeItem
      , setFilter
    });

  $: visible = items.filter ( i => i.toLowerCase().includes ( filter.toLowerCase() ) );
</script>

<div class="sidebar">
  <h3>{title}</h3>
  <input bind:value={filter} placeholder="filter..." />
  <ul>
    {#each visible as item, idx (item)}
      <li>
        {item}
        <button on:click={() => removeItem ( idx )}>x</button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .sidebar { padding: 10px; background: #fff8e1; border-radius: 4px; }
  h3 { margin: 0 0 10px; }
  ul { padding-left: 20px; margin: 5px 0; }
  li { margin: 2px 0; }
  button { margin-left: 5px; }
  input { margin-bottom: 5px; padding: 2px 4px; width: 100%; box-sizing: border-box; }
</style>