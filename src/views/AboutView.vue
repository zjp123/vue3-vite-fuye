<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div class="postcss-test">
      <p>Testing PostCSS features</p>
    </div>
  </div>
</template>

<style>
@media (width >= 1024px) {
  .about {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}

.about {
  & .postcss-test {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    
    & p {
      grid-column: span 3;
      color: #42b983;
      font-weight: bold;
      user-select: none;
    }
  }
}
</style>
