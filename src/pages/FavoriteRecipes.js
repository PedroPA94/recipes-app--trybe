import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ShareButton from '../components/ShareButton';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { nameHeader } from '../redux/actions';
import '../styles/favoriteRecipes.css';

function FavoriteRecipes(props) {
  const [filterAll, setFilterAll] = useState(true);
  const [typeFood, setTypeFood] = useState('');
  const [stateFavoriteRecipes, setStateFavoriteRecipes] = useState([]);

  useEffect(() => {
    const { updateCurrentPath, history } = props;
    const { location: { pathname } } = history;
    updateCurrentPath(pathname);

    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setStateFavoriteRecipes(favoriteRecipes);
  }, []);

  const removeFavoriteRecipe = (favoriteRecipes, id) => {
    const newFavoriteRecipes = favoriteRecipes.filter((recipe) => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
    setStateFavoriteRecipes(newFavoriteRecipes);
  };

  const handleFavoriteRecipeButton = (id) => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    removeFavoriteRecipe(favoriteRecipes, id);
  };

  return (
    <div className="favorite-recipes">
      <Header />
      <section className="filter-btns">
        <button
          className="btn-type-meals"
          type="button"
          data-testid="filter-by-all-btn"
          onClick={ () => setFilterAll(true) }
        >
          All
        </button>
        <button
          className="btn-type-meals"
          type="button"
          data-testid="filter-by-food-btn"
          onClick={ () => {
            setFilterAll(false);
            setTypeFood('food');
          } }
        >
          Food
        </button>
        <button
          className="btn-type-meals"
          type="button"
          data-testid="filter-by-drink-btn"
          onClick={ () => {
            setFilterAll(false);
            setTypeFood('drink');
          } }
        >
          Drinks
        </button>
      </section>
      { filterAll ? (
        stateFavoriteRecipes.map((fav, index) => (
          <div key={ fav.id } className="card-favorite-recipe">
            <Link
              to={ `/${fav.type}s/${fav.id}` }
            >
              <img
                src={ fav.image }
                alt={ fav.name }
                className="horizontal-image"
                data-testid={ `${index}-horizontal-image` }
              />
              <div>
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {(fav.type === 'food')
                    ? `${fav.nationality} - ${fav.category}`
                    : fav.alcoholicOrNot}

                </p>
                <h3 data-testid={ `${index}-horizontal-name` }>{fav.name}</h3>
              </div>
            </Link>
            <section>
              <ShareButton path={ `${fav.type}s` } id={ fav.id } />
              <button
                type="button"
                className="btn-type-meals"
                data-testid={ `${index}-horizontal-favorite-btn` }
                onClick={ () => handleFavoriteRecipeButton(fav.id) }
                src={ blackHeartIcon }
              >
                <img
                  src={ blackHeartIcon }
                  alt="Favorite"
                />
              </button>
            </section>
          </div>
        ))
      ) : (
        stateFavoriteRecipes.filter(({ type }) => type === typeFood).map((fav, index) => (
          <div key={ fav.id } className="card-favorite-recipe">
            <Link to={ `/${fav.type}s/${fav.id}` }>
              <img
                src={ fav.image }
                alt={ fav.name }
                className="horizontal-image"
                data-testid={ `${index}-horizontal-image` }
              />
              <div>
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {(fav.type === 'food')
                    ? `${fav.nationality} - ${fav.category}`
                    : fav.alcoholicOrNot}
                </p>
                <h3 data-testid={ `${index}-horizontal-name` }>{fav.name}</h3>
              </div>
            </Link>
            <section>
              <ShareButton path={ `${fav.type}s` } id={ fav.id } />
              <button
                type="button"
                data-testid={ `${index}-horizontal-favorite-btn` }
                onClick={ () => handleFavoriteRecipeButton(fav.id) }
                src={ blackHeartIcon }
                className="btn-type-meals"
              >
                <img
                  src={ blackHeartIcon }
                  alt="Favorite"
                />
              </button>
            </section>
          </div>

        ))
      )}
    </div>
  );
}

FavoriteRecipes.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
  updateCurrentPath: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentPath: (pathName) => dispatch(nameHeader(pathName)),
});

export default connect(null, mapDispatchToProps)(FavoriteRecipes);
