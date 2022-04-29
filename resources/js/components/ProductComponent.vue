<template>
  <div class="container my-5">
      <div class="row mb-3">
          <div class="col-md-4 offset-4">
              <button class="btn btn-success" @click="showCreateForm">Create</button>
          </div>
          <div class="col-md-4">
              <form @submit.prevent="getAllProducts">
                  <div class="input-group">
                      <input type="text" placeholder="search" name="search" class="form-control" v-model="searchInput" />
                      <div class="input-group-append">
                          <button type="submit" class="btn btn-success">
                              search
                          </button>
                      </div>
                  </div>
              </form>
          </div>

      </div>
      <div class="row">
          <div class="col-md-4">
              <div class="card card-primary shadow-sm">
                  <h3 class="card-header" :class="isEdit?'text-warning':'text-success'">{{isEdit?'Edit Form': 'Create Form'}}</h3>
                  <div class="card-body">
                      <AlertError :form="product">{{errorMessage}}</AlertError>
                      <form @submit.prevent="isEdit?updateProduct():addProduct()">
                          <div class="form-group mb-3">
                              <label>Name:</label>
                              <input type="text" class="form-control" v-model="product.name">
                              <div :class="{'text-danger':product.errors.has('name')}" v-if="product.errors.has('name')" v-html="product.errors.get('name')" />

                          </div>
                          <div class="form-group mb-3">
                              <label>Price</label>
                              <input type="number" class="form-control" v-model="product.price">
                              <div :class="{'text-danger':product.errors.has('price')}" v-if="product.errors.has('price')" v-html="product.errors.get('price')" />
                          </div>

                            <button type="submit" class="btn" :class="isEdit?'btn-warning':'btn-success'">
                                {{isEdit?'Edit Product':'Add Product'}}
                            </button>


                      </form>

                  </div>
              </div>
          </div>
          <div class="col-md-8">
              <table class="table">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="product in products.data" :key="product.id">
                          <td>{{product.id}}</td>
                          <td>{{product.name}}</td>
                          <td>{{product.price}}</td>
                          <td>
                              <button class="btn btn-warning btn-sm" @click="editProduct(product)">Edit</button>
                              <button class="btn btn-danger btn-sm" @click="destroyProduct(product.id)">Delete</button>
                          </td>
                      </tr>

                  </tbody>
              </table>
              <pagination :data="products" @pagination-change-page="getAllProducts" />
          </div>
      </div>
  </div>
</template>

<script>
// import LaravelVuePagination from 'laravel-vue-pagination';
import Form from 'vform'
export default {
    data(){
        return{
            isEdit: false,
            searchInput:'',
            products:{},
            product:new Form({
                name:'',
                price:''
            }),
            errorMessage: ''
        }
    },
    methods:{
        showCreateForm(){
            this.isEdit = false;
            this.product = new Form({})
        },
        getAllProducts(page = 1){
            this.$Progress.start();
            axios.get(`/api/products?page=${page}&search=${this.searchInput}`)
            .then(res => {
                this.products = res.data;
                this.$Progress.finish()
            })
            .catch(err => this.$Progress.fail());
        },
        async addProduct(){
            try{
                const response = await this.product.post("/api/products");
                if(response.status === 404){
                    throw new Error("Fail ! Cannot Create Product");
                }
                this.product = response.data;
                this.getAllProducts();
                this.product = new Form({});
                Toast.fire({
                    icon: 'success',
                    title: 'Create Product Successfully!'
                })
            }catch(error){
                this.errorMessage = error.response.data.message;
            }
        },
        destroyProduct(id){
            // if(!confirm('Are you suer to delete this product?')){
            //     return;
            // }

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to delete this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Delete'
                }).then((result) => {
                if (result.isConfirmed) {

                    axios.delete(`/api/products/${id}`)
                    .then(res => this.getAllProducts())

                    Swal.fire(
                    'Deleted!',
                    'success'
                    )

                    Toast.fire({
                        icon: 'success',
                        title: 'Delete Successfully!'
                    })
                }
            })


        },
        editProduct(product){
            this.product = new Form(product);
            this.isEdit = true;
        },
        async updateProduct(){

            try{
                const response = await this.product.put(`/api/products/${this.product.id}`);
                if(response.status === 404){
                    throw new Error("Fail ! Cannot Create Product");
                }

                this.product = new Form(response.data);
                this.getAllProducts();
                Toast.fire({
                    icon: 'success',
                    title: 'Update successfully'
                })
            }catch(error){
                this.errorMessage = error.response.data.message;
            }
        }
    },
    created(){
        this.getAllProducts();
    }

}
</script>

<style>

</style>
