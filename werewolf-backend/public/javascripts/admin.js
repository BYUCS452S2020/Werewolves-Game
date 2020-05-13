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
          let response = await axios.post('/characters', {
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
          this.characters = response.data;
  
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
  