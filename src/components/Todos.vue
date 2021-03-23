<template>
    <section class="todoapp">
        <header class="header">            
            <h1>Todolist</h1>
            <input type="text" class="new-todo-list" placeholder="Ajouter une une todo list" v-bind:value="todoListName" v-on:input="todoListName = $event.target.value" @keyup.enter="addTodoList"> <!-- ajout d'un listener d'evenement ainsi que du modele virtuel -->
        </header>
        <body>            
            <h2>Todos</h2>
            <input type="text" class="new-todo" placeholder="Ajouter une tache" v-bind:value="todoName" v-on:input="todoName = $event.target.value" @keyup.enter="addTodo"> <!-- ajout d'un listener d'evenement ainsi que du modele virtuel -->
            <div class="main">
                <input type="checkbox" v-model="allDone">
                <ul class="todo-list">
                    <li class="todo" v-for="todo in filteredTodos" v-bind:key="todo" :class="{completed: todo.completed, editing: todo === editing}">
                        <div class="view">
                            <input type="checkbox" v-model="todo.completed" class="toggle">
                            <label @dblclick="editTodo(todo)">{{ todo.name }}</label> <!-- lance la methode editTodo lors d'un evenement double clique -->
                            <button class="destroy" @click.prevent="deleteTodo(todo)"></button>
                        </div>
                        <input type="text" class="edit" v-model="todo.name" @keyup.enter="doneEdit" @blur="doneEdit" @keyup.esc="cancelEdit" v-focus="todo === editing">
                    </li>
                </ul>
            </div>
        </body>
        <footer class="footer" v-show="hasTodos">
            <span class="todo-count"><strong>{{ remaining }}</strong> à faire</span>
            <ul class="filters">
                <li><a href="#" :class=" {selected: filter === 'all'} "  @click.prevent="filter = 'all'">Toutes</a></li>
                <li><a href="#" :class=" {selected: filter === 'todo'} " @click.prevent="filter = 'todo' ">a faire</a></li>
                <li><a href="#" :class=" {selected: filter === 'done'} " @click.prevent="filter = 'done' ">faites</a></li>
            </ul>
            <button class="clear-completed" v-show="completed" @click="deleteCompleted">Supprimer les taches finies</button>
        </footer>
    </section>
</template>


<script>
import Vue from 'vue'
import axios from 'axios'
    export default {    
        //stockage des entrées
        props: {
            value: {type: Array, default () {return []} }
        },

        //Type des entrées stockées, avec leurs infos
        data () {
            return {
                todoListId: 0,
                todos: this.value,
                todoName: '',
                todoListName: '',
                filter: 'all',
                editing: null,
                oldTodo: '',
            }
        },
        //le watcher sur Value pour update le parents
        watch: {
            value (value) {
                this.todos = value
            }
        },
        methods: {
            //methode d'ajout d'une entrée (todo)
            addTodoList () {
                axios.post(
                    "http://138.68.74.39/api/todolist?name=" + this.todoListName,
                    {},
                    {
                        headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                            }
                        }
                    )
                .then(this.todoListId = function (response) {
                    return response.data.id
                }) //Save in API
            },
            addTodoAPI () {
                //appel axiom pour ajouter le todos a l'api
                axios.post(
                    "http://138.68.74.39/api/todo?name=" + this.todoName + "&completed=" + false + "&todolist_id=" + this.todoListId,
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                )
                .then() //Save in API
            },
            addTodo () {
                this.addTodoAPI()
                this.todos.push({
                    completed: false,
                    name: this.todoName
                })
                this.todoName = ''
            },
            //methode supprimant d'une entrée (todo)
            deleteTodo (todo) {
                this.deleteTodoAPI(todo)
                this.todos = this.todos.filter(i => i !== todo)
                this.$emit('input' , this.todos)
            },
            deleteTodoAPI (todo) {
                console.log(localStorage.getItem('tokenBearer'))
                axios.delete(
                    "http://138.68.74.39/api/todo/1",
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                ).then()  //ecriture dans l'api             
            },
            //methode de vérification par rapport à la liste de données (todo)
            deleteCompleted (todo) {
                this.todos = this.todos.filter(todo => !todo.completed)
                this.$emit('input' , this.todos)
                this.deleteTodo()
                this.deleteTodoAPI()
            },
            editTodoAPI() {
                axios.patch("http://138.68.74.39/api/completeTodo/1?name=" + this.todos.name , {} , {headers: { Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')}} ).then()  //ecriture dans l'api
            },
            //methode d'edition  d'une entrée (todo)
            editTodo (todo) {
                this.editing = todo
                this.oldTodo = todo.name
            },
            //methode de complétion d'edition, annulant le state de editing (todo)
            doneEdit () {
                this.editing = null
                
            },
            //methode pareil que doneEdit, mais on remet l'ancien todo (todo)
            cancelEdit () {
                this.editing.name = this.oldTodo
                this.doneEdit()
            }
        },
        //propriétées computed; des données réactives, notamment pour le compte des taches 
        computed: {
            //Methode pour compter le nombre de taches complettes
            allDone: {
                //getter et setter
                get () {
                    return this.remaining === 0
                },
                set (value) {
                    this.todos.forEach(todo => {
                        todo.completed = value
                    })
                
                }
            },
            //filters avec tri des todos faites/non faites
            remaining () { return this.todos.filter(todo => !todo.completed).length},
            completed () { return this.todos.filter(todo => todo.completed).length},
            hasTodos() {
                return this.todos.length > 0
            },
            filteredTodos () {
                if(this.filter === 'todo') {
                    return this.todos.filter(todo => !todo.completed) 
                } else if (this.filter ==='done') {
                    return this.todos.filter(todo => todo.completed)
                }
                return this.todos
            }
        },
        //directives: active les changements
        directives: {
            focus (el, value){
                if (value) {
                    Vue.nextTick(_ => {
                    
                    el.focus()
                    })
                }
            }
        }
    }
    </script>
<style src='./todos.css'></style>