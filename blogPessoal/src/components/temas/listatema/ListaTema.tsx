import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Tema from '../../../models/Tema';
import { busca } from '../../../services/Service';
import { UserState } from '../../../store/token/Reducer';
import './ListaTema.css';
import { toast } from 'react-toastify';
import { Action, addToken } from '../../../store/token/Actions';

function ListaTema() {
  const [temas, setTemas] = useState<Tema[]>([])
  
  const token = useSelector<UserState, UserState["tokens"]>(
    (state) => state.tokens
  )

  let navigate = useNavigate();

  useEffect(() => {
    if (token === '') {
      toast.error('Usuário não autenticado!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored',
        progress: undefined,
      });
      navigate("/login")
    }
  }, [token])



  async function getTema() {
    try {
      await busca("/tema", setTemas, {
        headers: {
          'Authorization': token
        }
      })
    } catch (error: any) {
      if (error.response?.status === 403) {
        dispatch(addToken(''))
      }
    }
  }

  useEffect(()=>{
    getTema()
  }, [temas.length])


  return (
    <>
      {temas.length === 0 ? (<div className="spinner"></div>) : (
        temas.map((temas) => (
          <Box marginX={20} m={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Descrição:
                </Typography>
                <Typography variant="h5" component="h2">
                  {temas.descricao}
                </Typography>
              </CardContent>
              <CardActions>
                <Box display="flex" justifyContent="center" mb={1.5} >

                  <Link to={`/formularioTema/${temas.id}`} className="text-decorator-none">
                    <Box mx={1}>
                      <Button variant="contained" className="marginLeft" size='small' color="primary" >
                        atualizar
                      </Button>
                    </Box>
                  </Link>
                  <Link to={`/deletarTema/${temas.id}`} className="text-decorator-none">
                    <Box mx={1}>
                      <Button variant="contained" size='small' color="secondary">
                        deletar
                      </Button>
                    </Box>
                  </Link>
                </Box>
              </CardActions>
            </Card>
          </Box>
        ))
      )}
    </>
  );
}


export default ListaTema;

function dispatch(arg0: Action) {
  throw new Error('Function not implemented.');
}
