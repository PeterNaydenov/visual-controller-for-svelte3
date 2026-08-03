<script>
  export let setupUpdates;

  let message = 'Hello from Header!';
  let count = 0;

  function changeMessage ( msg ) {
        message = msg;
    }

  function increment () {
        count += 1;
    }

  function getCount () {
        return count;
    }

  setupUpdates ({
        changeMessage
      , increment
      , getCount
    });
</script>

<div class="header">
  <h3>{message}</h3>
  <p>Count: {count}</p>
  <button on:click={increment}>Increment</button>
</div>

<style>
  .header { padding: 10px; background: #f0f0f0; border-radius: 4px; }
  h3 { margin: 0 0 10px; }
  button { margin-right: 5px; }
</style>