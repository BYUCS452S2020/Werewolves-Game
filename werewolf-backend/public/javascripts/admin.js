var app = new Vue({
    el: '#admin',
    data: {
      characters: [],
      name: "",
      side: false,
      ability: "",
      detail: "",
    },
  
    created() {
      this.getItems();
    },
  
  
    methods: {
      async upload() {
        try {
          const formData = new FormData();
          await axios.post('/characters', {
            name: this.name,
            side: this.side,
            ability: this.ability,
            detail: this.detail
          });
          this.name = "";
          this.side = false;
          this.ability = "";
          this.detail = "";
        }
        catch (error) {
          console.log(error);
        }
        this.getItems();
      },
      async getItems() {
        try {
          let response = await axios.get("/characters");
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
      },
      async deleteItem(character) {
        try {
          let response = axios.delete("/characters/" + character.name);
          this.getItems();
          return true;
        }
        catch (error) {
          console.log(error);
        }
      },
  
    }
  });
  