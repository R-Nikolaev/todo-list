class todo {

  selectors = {
    root: '[data-js-todo]',
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    searchTaskForm: '[data-js-todo-search-task-form]',
    searchTaskInput: '[data-js-todo-search-task-input]',
    searchTaskSelect: '[data-js-todo-search-task-select]',
    totalTasks: '[data-js-todo-total-tasks]',
    completeTasks: '[data-js-todo-complete-tasks]',
    list: '[data-js-todo-list]',
    item: '[data-js-todo-item]',
    itemCheckbox: '[data-js-todo-item-checkbox]',
    itemLabel: '[data-js-todo-item-label]',
    itemDeleteButton: '[data-js-todo-item-delete-button]',
    category: '[data-js-todo-category]',
    categoryItem: '[data-js-todo-category-item]',
  }

  stateClasses = {
    isDisappearing: 'is-disappearing',
    isActive: 'is-active',
  }

  localStorageKey = 'todo-items'

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.newTaskFormElement = this.rootElement.querySelector(this.selectors.newTaskForm)
    this.newTaskInputElement = this.rootElement.querySelector(this.selectors.newTaskInput)
    this.searcTaskFormElement = this.rootElement.querySelector(this.selectors.searchTaskForm)
    this.searchTaskInputElement = this.rootElement.querySelector(this.selectors.searchTaskInput)
    this.searchTaskSelectElement = this.rootElement.querySelector(this.selectors.searchTaskSelect)
    this.totalTasksElement = this.rootElement.querySelector(this.selectors.totalTasks)
    this.completeTasksElement = this.rootElement.querySelector(this.selectors.completeTasks)
    this.listElement = this.rootElement.querySelector(this.selectors.list)
    this.categoryElement = this.rootElement.querySelector(this.selectors.category)
    this.state = {
      items: this.getItemsFromLocalStorage(),
      selectedCategory: null,
      filteredItems: null,
      searchQuery: '',
    }
    this.categories = [
      {
        title: 'Работа',
        color: '#5B8DEF',
      },
      {
        title: 'Учёба',
        color: '#E45A23',
      },
      {
        title: 'Дом',
        color: '#73C07B',
      },
      {
        title: 'Покупки',
        color: '#E1A13C',
      },
    ]
    this.render()
    this.bindEvents()
  }

  getItemsFromLocalStorage() {
    const rawData = localStorage.getItem(this.localStorageKey)
    if (!rawData) return []

    try {
      const parsedData = JSON.parse(rawData)
      return Array.isArray(parsedData) ? parsedData : []
    } catch {
      return []
    }
  }

  saveItemsToLocalStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.state.items),
    )
  }

  render() {
    this.totalTasksElement.textContent = this.state.items.length
    this.completeTasksElement.textContent = this.state.items.filter(task => task.isChecked).length

    const items = this.state.filteredItems ?? this.state.items
    this.listElement.innerHTML = items
      .map(({
        id,
        title,
        isChecked,
        category,
      }) => {
        const categoryData = this.categories.find(c => c.title === category)
        const color = categoryData ? categoryData.color : ''

        return `
          <li class="todo__item todo-item"
            data-js-todo-item
        >
          <input type="checkbox"
                 class="todo-item__checkbox"
                 id="${id}"
                 ${isChecked ? 'checked' : ''}
                 data-js-todo-item-checkbox
          >
          <label for="${id}"
                 class="todo-item__label"
                 data-js-todo-item-label
          >
            ${title}
          </label>
          
          ${category ? `
          <span class="todo-item__badge"
          style="background-color: ${color}">
                ${category}
          </span>
          ` : ''}
          <button class="todo-item__delete-button"
                  data-js-todo-item-delete-button
                  aria-label="delete"
                  title="delete"
          >
            <svg width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.2016 9.98535H12.8711V15.5072H14.2016V9.98535Z"
                    fill="#808080"
              />
              <path d="M11.4624 9.98535H10.1318V15.5072H11.4624V9.98535Z"
                    fill="#808080"
              />
              <path d="M18.478 7.16712C18.4754 7.03061 18.4295 6.89846 18.3469 6.78975C18.2642 6.68104 18.1492 6.6014 18.0184 6.56232C17.9596 6.53782 17.8974 6.52252 17.8339 6.51696H14.2868C14.1525 6.07791 13.8808 5.69355 13.5117 5.42047C13.1426 5.14739 12.6956 5 12.2365 5C11.7774 5 11.3304 5.14739 10.9613 5.42047C10.5922 5.69355 10.3205 6.07791 10.1862 6.51696H6.63911C6.58068 6.51814 6.52269 6.52729 6.46674 6.54418H6.45162C6.31318 6.58701 6.19334 6.67547 6.11163 6.79515C6.02992 6.91483 5.99117 7.05866 6.00169 7.20319C6.01222 7.34771 6.0714 7.48441 6.16958 7.59099C6.26776 7.69757 6.39916 7.76774 6.54234 7.79006L7.25298 17.5334C7.26382 17.9127 7.41693 18.2741 7.68191 18.5458C7.94688 18.8175 8.30435 18.9797 8.68332 19H15.7867C16.1662 18.9804 16.5244 18.8186 16.79 18.5468C17.0556 18.2751 17.2092 17.9132 17.22 17.5334L17.9277 7.79914C18.0802 7.77797 18.22 7.70232 18.3212 7.58615C18.4223 7.46999 18.478 7.32116 18.478 7.16712ZM12.2365 6.21456C12.3661 6.21458 12.4943 6.24146 12.6129 6.29351C12.7316 6.34556 12.8382 6.42164 12.926 6.51696H11.547C11.6346 6.42135 11.7411 6.34507 11.8599 6.29299C11.9786 6.24092 12.1069 6.21421 12.2365 6.21456ZM15.7867 17.7904H8.68332C8.60168 17.7904 8.47467 17.6573 8.45955 17.4457L7.75798 7.81123H16.715L16.0135 17.4457C15.9984 17.6573 15.8714 17.7904 15.7867 17.7904Z"
                    fill="#808080"
              />
            </svg>
          </button>
        </li>
      `
      })
      .join('')


    this.categoryElement.innerHTML = this.categories
      .map(({
          title,
          color,
        }) => `
                <li class="todo__category-item"
                style="background: ${color}"
            data-js-todo-category-item
        >
          ${title}
        </li>
      `,
      )
      .join('')

    this.searchTaskSelectElement.innerHTML = `
    <option value="all">All</option>
    ${this.categories
      .map(c => `<option value="${c.title.toLowerCase()}">${c.title}</option>`)
      .join('')}
  `
  }

  filter() {
    const query = this.state.searchQuery.toLowerCase()
    const selectedCategory = this.searchTaskSelectElement.value

    this.state.filteredItems = this.state.items.filter(({
      title,
      category,
    }) => {
      const matchesTitle = title.toLowerCase().includes(query)
      const matchesCategory = selectedCategory === 'all'
        ? true
        : category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesTitle && matchesCategory
    })
    this.render()
  }

  resetFilter() {
    this.state.selectedCategory = null
    this.state.filteredItems = null
    this.state.searchQuery = ''
    this.render()
  }

  addItem(title) {
    this.state.items.push({
      id: crypto.randomUUID(),
      title,
      isChecked: false,
      category: this.state.selectedCategory ? this.state.selectedCategory.title : '',
    })
    this.saveItemsToLocalStorage()
    this.render()
  }

  deleteItem(id) {
    this.state.items = this.state.items.filter(item => item.id !== id)
    this.saveItemsToLocalStorage()
    this.render()
  }

  toggleCheckedState(id) {
    this.state.items = this.state.items
      .map(item => {
        if (item.id === id) {
          return {
            ...item,
            isChecked: !item.isChecked,
          }
        }
        return item
      })
    this.saveItemsToLocalStorage()
    this.render()
  }

  onNewTaskFormSubmit = (event) => {
    event.preventDefault()

    const title = this.newTaskInputElement.value

    if (title.trim().length > 0) {
      this.addItem(title)
      this.newTaskInputElement.value = ''
      this.newTaskInputElement.focus()
    }
  }

  onSearchTaskFormSubmit = (event) => {
    event.preventDefault()
  }
  onSearchTaskInputChange = ({ target }) => {
    const value = target.value.trim()

    if (value.length > 0) {
      this.state.searchQuery = value
      this.filter()
    } else {
      this.resetFilter()
    }
  }

  onSearchCategorySelectChange = () => {
    this.filter()
  }

  onClick = ({ target }) => {
    if (target.matches(this.selectors.itemDeleteButton)) {
      const itemElement = target.closest(this.selectors.item)
      const checkbox = itemElement.querySelector(this.selectors.itemCheckbox)

      itemElement.classList.add(this.stateClasses.isDisappearing)

      setTimeout(() => {
        this.deleteItem(checkbox.id)
      }, 400)
    }

    if (target.matches(this.selectors.categoryItem)) {
      const categoryRoot = target.closest(this.selectors.category)
      const wasActive = target.classList.contains(this.stateClasses.isActive)

      categoryRoot
        .querySelectorAll(this.selectors.categoryItem)
        .forEach(el => el.classList.remove(this.stateClasses.isActive))

      if (!wasActive) {
        target.classList.add(this.stateClasses.isActive)
        const title = target.textContent.trim()
        const category = this.categories.find(c => c.title === title)

        this.state.selectedCategory = category || null
      } else {
        this.state.selectedCategory = null
      }
    }
  }

  onChange = ({ target }) => {
    if (target.matches(this.selectors.itemCheckbox)) {
      this.toggleCheckedState(target.id)
    }
  }

  bindEvents() {
    this.newTaskFormElement.addEventListener('submit', this.onNewTaskFormSubmit)
    this.listElement.addEventListener('click', this.onClick)
    this.listElement.addEventListener('change', this.onChange)
    this.categoryElement.addEventListener('click', this.onClick)
    this.searcTaskFormElement.addEventListener('submit', this.onSearchTaskFormSubmit)
    this.searchTaskInputElement.addEventListener('input', this.onSearchTaskInputChange)
    this.searchTaskSelectElement.addEventListener('change', this.onSearchCategorySelectChange)
  }
}

new

todo()