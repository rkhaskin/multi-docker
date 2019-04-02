import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: '',
        isModified: false
    };


    componentDidMount() {
        console.log("CDDDDDDMMMMM");
        this.fetchValues();
        this.fetchIndexes();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("PPPPPPPPP ", prevState.isModified);
        if (prevState.isModified !== this.state.isModified && this.state.isModified) {
            console.log("RRRRRRRRRRRRRRRRRRR");
            this.fetchValues();
            this.fetchIndexes();
            this.setState({isModified: false})
        }
    }
    async fetchValues() {
        const values = await axios.get('/api/values/current');
        console.log("fetchValues", values.data);
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        const indexes = await axios.get('/api/values/all');
        this.setState({ seenIndexes: indexes.data });
    }

    renderseenIndexes() {
        var seen = this.state.seenIndexes.map(({ number }) => number).join(', ');
        console.log("AAAAAAA " + seen);
        return seen;
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        console.log("submittttttt");

        await axios.post('/api/values', {
            index: this.state.index
        });

        this.setState({ index: '', isModified: true });
        console.log("after update");

    }

    renderValues() {
        const entries = [];
        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} the value is {this.state.values[key]}
                </div>
            )
        }

        console.log("BBBBBBBB " + entries)
        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen: </h3>
                {this.renderseenIndexes()}
                <h3>Calculated values: </h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;