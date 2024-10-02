import PropTypes from 'prop-types';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const categoryMapping = {
    "Pasta": 1,
    "Pure Veg": 2,
    "Cake": 3,
    "Sandwich": 4,
    "Deserts": 5,
    "Rolls": 6,
    "Salad": 7,
    "Noodles":8
};

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore Our Menu</h1>
            <p className='explore-menu-text'>Choose from this diverse menu</p>
            <div className="explore-menu-list">
                {menu_list.map((item, index) => {
                    return (
                        <div
                            onClick={() => {
                                setCategory(prev => {
                                    const newCategory = categoryMapping[item.menu_name];
                                    // Toggle to "All" if the same category is selected
                                    return prev === newCategory ? "All" : newCategory;
                                });
                            }}
                            key={index}
                            className={`explore-menu-list-item ${category === categoryMapping[item.menu_name] ? "active" : ""}`}
                        >
                            <img src={item.menu_image} alt={item.menu_name} />
                            <p>{item.menu_name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

ExploreMenu.propTypes = {
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setCategory: PropTypes.func.isRequired,
};

export default ExploreMenu;
