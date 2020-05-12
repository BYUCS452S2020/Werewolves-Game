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
          let list = response.data.sort(function(a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
          });
          this.characters = list;
  
          return true;
        }
        catch (error) {
          console.log(error);
        }
      }
  
    }
  });
  