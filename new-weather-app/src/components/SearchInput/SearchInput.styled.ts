import styled from 'styled-components';

export const SearchInputWrapper = styled.div`
  position: sticky;
  top: 5px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 780px;
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  height: 3em;
  width: 100%;
  padding: 0 10px;
  border: 2px solid hsl(250, 50%, 50%);
  border-radius: 4px 0px 0px 4px;
`;

export const Button = styled.button`
  font-size: 1em;
  height: 3em;
  width: 40%;
  max-width: 7em;
  padding: 10px 20px;
  background-color: hsl(250, 50%, 50%);
  color: hsl(45, 29%, 97%);
  font-weight: 900;
  border: 2px solid hsl(250, 50%, 50%);
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
`;
