import Todos from '../components/Todos'
export default {
  data () {
    return {
      todos: [{
        name: 'Demo',
        completed: true
      }]
    }
  },
  methods: {
    //ajoute une taches préfaite pour test developpement
    addTodo () {
      this.todos.push({
        name: 'Jean',
        completed: false
      })
    }
  },
  components: {
    Todos
  },
}