import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
import { Character } from '../../Models/CharacterModel';
import './CharactersPage.scss';

const CharactersPage = () => {
  const [visibleCharacters, setVisibleCharacters] = useState<Character[]>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const status = searchParams.get('status');
  const page = searchParams.get('page');
  const [isLoading, setisLoading] = useState<boolean>(false);

  const getCharacters = async () => {
    setisLoading(true);
    try {
      const response = await axios
        .get(`https://rickandmortyapi.com/api/character/?${searchParams}`);
      setVisibleCharacters(response.data.results);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrorMessage('Nothing to show');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Not axios error');
      }
    } finally {
      setisLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    getCharacters();
  }, []);
  useEffect(() => {
    getCharacters();
  }, [searchParams, currentPage]);
  return (

    <div className="characters__maincontainer">
      <h1>Characters Page</h1>
      <div className="btn__container">
        <button
          className="btn btn-all"
          onClick={() => {
            setSearchParams({});
          }}
        >
          All
        </button>
        <button
          className="btn btn-alive"
          onClick={() => {
            setSearchParams({ status: 'alive' });
          }}
        >
          Alive
        </button>
        <button
          className="btn btn-dead"
          onClick={() => {
            setSearchParams({ status: 'dead' });
          }}
        >
          Dead
        </button>
        <button
          className="btn  btn-unknown"
          onClick={() => {
            setSearchParams({ status: 'unknown' });
          }}
        >
          Unknown
        </button>
      </div>
      <div className="btn__container">
        <button
          disabled={Number(page) <= 1}
          className="btn"
          onClick={() => {
            setSearchParams({ ...searchParams, page: (currentPage - 1).toString() });
            setCurrentPage(currentPage - 1);
          }}
        >
          {'<'}
        </button>
        <button
          className="btn"
          onClick={() => {
            setSearchParams({ ...searchParams, page: (currentPage + 1).toString() });
            setCurrentPage(currentPage + 1);
          }}
        >
          {'>'}
        </button>
      </div>
      {isLoading && <Loader />}
      <div className="characters__container__cards">
        {visibleCharacters && visibleCharacters.map((character) => (
          <div
            className={`character__card ${character.status}`}
            key={character.id}
          >
            <div className="character__card__top">
              <img className="character__picture" src={character.image} alt={character.name} />
              <span>
                ID:
                {' '}
                {character.id}
              </span>
              <span>
                Name:
                {' '}
                {character.name}
              </span>
            </div>
            <button
              className="btn-grad"
              onClick={() => navigate(`/characters/${character.id}`)}
            >
              Read more
            </button>
          </div>
        ))}
      </div>
      {errorMessage && (<span>{errorMessage}</span>)}

    </div>
  );
};

export default CharactersPage;
