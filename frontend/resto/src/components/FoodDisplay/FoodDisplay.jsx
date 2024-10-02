import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import axios from 'axios';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const FoodDisplay = ({ category }) => {
    const [foodList, setFoodList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8084/api/menu-items')
            .then(response => {
                setFoodList(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the menu items!', error);
            });
    }, []);

    useEffect(() => {
        let data = foodList;

        if (category !== "All") {
            data = data.filter(item => item.categoryId === category);
        }

        setFilteredData(data);
    }, [category, foodList]);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes</h2>
            <div className="food-display-list">
                {filteredData.map((item, index) => (
                    <FoodItem
                        key={index}
                        id={item.id.toString()}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};

// Add prop validation
FoodDisplay.propTypes = {
    category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired, // Ensure category is either a string or number and is required
};

export default FoodDisplay;
