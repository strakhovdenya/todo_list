import React, {Component} from 'react';

import AppHeader from '../../components/app-header';
import SearchPanel from '../../components/search-panel/';
import TodoList from '../../components/todo-list';
import ItemAddForm from '../item-add-form';
import ItemStatusFilter from '../../components/item-status-filter';

import './app.css';

export default class App extends Component {

    maxId = 100;

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch'),
        ],
        term: '',
        filter: 'all' // active, done, all
    };

    createTodoItem(text) {
        return {
            label: text,
            important: false,
            done: false,
            id: this.maxId++,
        };
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newTodoData = [
                ...todoData, newItem
            ];

            return {todoData: newTodoData}
        });
    }

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);

            const newTodoData = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];

            return {todoData: newTodoData};
        });
    }

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};

        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {todoData: this.toggleProperty(todoData, id, 'done')};
        });
    };
    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {todoData: this.toggleProperty(todoData, id, 'important')};
        });
    };

    search(items, text) {
        if (text.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1
        })
    };

    onSearchChange = (term) => {
        this.setState({term});
    }

    onFilterChange = (filter) => {
        this.setState({filter});
    }


    filter(items, filter) {
        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    };

    render() {

        const {todoData, term, filter} = this.state;

        const visibleItems = this.filter(this.search(todoData, term), filter);

        const doneCount = todoData.filter((el) => el.done).length;
        const toDoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={toDoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel
                        onSearchChange={this.onSearchChange}/>
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}/>
                </div>

                <TodoList todos={visibleItems}
                          onDeleted={this.deleteItem}
                          onToggleDone={this.onToggleDone}
                          onToggleImportant={this.onToggleImportant}
                />

                <ItemAddForm
                    onAddItem={this.addItem}/>
            </div>
        )
            ;
    }
};
