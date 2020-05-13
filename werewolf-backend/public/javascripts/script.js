var app = new Vue({
    el: '#app',
    data: {
      characters: []
    },
    created() {
      this.getItems();
    },
  
  
    methods: {
      async getItems() {
        try {
          console.log("trying to retrieve");
          let response = await axios.get("/characters");
          console.log(response.message);
          this.characters = response.data;
  
          return true;
        }
        catch (error) {
          console.log(error);
        }
      }
  
    }
  });
  