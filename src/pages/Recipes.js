import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RecipeMealCard from '../components/RecipeMealCard';
import searchRecipes from '../redux/actions';
import RecipeDrinkCard from '../components/RecipeDrinkCard';
import fetchEndPoint from '../services/fetchFunction';

function Recipes(props) {
  const { getRecipes, recipes } = props;
  const { match: { path } } = props;

  const [type, setType] = useState('meals');
  const [categoriesRecipes, setCategoriesRecipes] = useState([]);
  const maxRecipesToShow = 12;

  useEffect(() => {
    console.log(type);
    if (path === '/foods') {
      getRecipes('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      setType('meals');
    } else {
      getRecipes('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      setType('drinks');
    }
  }, []);

  const getFirstFive = (categories) => {
    const maxCategories = 5;
    setCategoriesRecipes(categories.filter((_category, index) => index < maxCategories));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      console.log(type);
      if (type === 'meals') {
        const categories = await fetchEndPoint('https://www.themealdb.com/api/json/v1/1/list.php?c=list');

        getFirstFive(await categories.meals);
      } else {
        const categories = await fetchEndPoint('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');

        getFirstFive(await categories.drinks);
      }
    };
    fetchCategories();
  }, [type]);

  const fetchRecipesByCategory = ({ target: { value } }) => {
    console.log(value);
  }

  return (
    <div>
      { recipes[type]
        && recipes[type].filter((_recipe, index) => index < maxRecipesToShow)
          .map((recipe, index) => {
            if (type === 'meals') {
              return (<RecipeMealCard
                key={ recipe.idMeal }
                recipe={ recipe }
                index={ index }
              />);
            }
            return (<RecipeDrinkCard
              key={ recipe.idDrink }
              recipe={ recipe }
              index={ index }
            />);
          })}
      <div>
        { categoriesRecipes
        && categoriesRecipes.map((category) => (
          <button
            key={ category.strCategory }
            id="button-category"
            type="button"
            data-testid={ `${category.strCategory}-category-filter` }
            onClick={ fetchRecipesByCategory }
            value={ category.strCategory }
          >
            {category.strCategory}
          </button>))}
      </div>
      <p>Recipes</p>
    </div>
  );
}

Recipes.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  getRecipes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  recipes: state.recipesReducer.recipes,
});

const mapDispatchToProps = (dispatch) => ({
  getRecipes: (endpoint) => dispatch(searchRecipes(endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recipes);
