<template>
    <section class="todoapp">
        <header class="header">            
            <h1>Todos</h1>
            <input type="text" class="new-todo" placeholder="Ajouter une tache" v-bind:value="todoName" v-on:input="todoName = $event.target.value" @keyup.enter="addTodo"> <!-- ajout d'un listener d'evenement ainsi que du modele virtuel -->
        </header>
        <body>            
            <div class="main">
                <input type="checkbox" v-model="allDone">
                <ul class="todo-list">
                    <li class="todo" v-for="todo in filteredTodos" v-bind:key="todo" :class="{completed: todo.completed, editing: todo === editing}">
                        <div class="view">
                            <input type="checkbox" v-model="todo.completed" class="toggle">
                            <label @dblclick="editTodo(todo)">{{ todo.name }}</label> <!-- lance la methode editTodo lors d'un evenement double clique -->
                            <button class="destroy" @click.prevent="deleteTodo(todo)"></button>
                        </div>
                        <input type="text" class="edit" v-model="todo.name" @keyup.enter="doneEdit(todo)" @blur="doneEdit" @keyup.esc="cancelEdit" v-focus="todo === editing">
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
    
        mounted () {
            axios.post(
                "http://138.68.74.39/api/todolist?name=todolist",
                {},
                {
                    headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                )
            .then(result => (this.todoListId = result.data.id)) //Save in API
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
            addTodoAPI () {
                //appel axiom pour ajouter le todos a l'api
                axios.post(
                    "http://138.68.74.39/api/todo?name=" + this.todoName + "&completed=0&todolist_id=" + this.todoListId,
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                ).then(result => (
                    this.todos.push({
                        completed: false,
                        name: result.data.name,
                        id: result.data.id
                    }))
                ) //Save in API
            },
            addTodo () {
                this.addTodoAPI();
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
                    "http://138.68.74.39/api/todo/" + todo['id'],
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                ).then()  //ecriture dans l'api             
            },
            //methode de vérification par rapport à la liste de données (todo)
            deleteCompleted () {
                this.todos = this.todos.filter(todo => !todo.completed)
                this.$emit('input' , this.todos)
                this.todos.forEach((value, index) => {
                    this.deleteTodo(value)
                })
            },
            editTodoAPI(todo) {
                axios.patch("http://138.68.74.39/api/todo/" + todo['id'] + "?name=" + todo['name'], {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('tokenBearer')
                        }
                    }
                ).then() 
            },
            //methode d'edition  d'une entrée (todo)
            editTodo (todo) {
                this.editing = todo
                this.oldTodo = todo.name
            },
            //methode de complétion d'edition, annulant le state de editing (todo)
            doneEdit (todo) {
                this.editTodoAPI(todo)
                this.editing = null
            },
            //methode pareil que doneEdit, mais on remet l'ancien todo (todo)
            cancelEdit () {
                this.editing.name = this.oldTodo
                this.editing = null
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