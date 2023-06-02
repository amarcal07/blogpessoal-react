import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Tema from '../../../models/Tema';
import { buscaId, deleteId } from '../../../services/Service';
import { addToken } from '../../../store/token/Actions';
import { UserState } from '../../../store/token/Reducer';
import './DeletarTema.css';


function DeletarTema() {
  let navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch()

  const token = useSelector<UserState, UserState["tokens"]>(
    (state) => state.tokens
  )

  const [tema, setTema] = useState<Tema>()

  useEffect(() => {
    if (token == "") {
      toast.error('Usuário não autenticado!', {
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

  useEffect(() => {
    if (id !== undefined) {
      findById(id)
    }
  }, [id])

  async function findById(id: string) {
    try {
      await buscaId(`/temas/${id}`, setTema, {
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
  async function sim() {
    navigate('/temas')
    try {
      await deleteId(`/temas/${id}`, {
        headers: {
          'Authorization': token
        }
      });
      toast.success('Tema deletado com sucesso!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored',
        progress: undefined,
      });
    } catch (error: any) {
      if (error.response?.status === 403) {
        dispatch(addToken(''))
      } else {
        toast.error("Erro ao Deletar Tema", {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'colored',
          progress: undefined,
        });
      }
    }
  }

  function nao() {
    navigate('/temas')
  }

  return (
    <>
      <Box m={2}>
        <Card variant="outlined">
          <CardContent>
            <Box justifyContent="center">
              <Typography color="textSecondary" gutterBottom>
                Deseja deletar o Tema:
              </Typography>
              <Typography color="textSecondary">
                {tema?.descricao}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Box display="flex" justifyContent="start" ml={1.0} mb={2} >
              <Box mx={2}>
                <Button onClick={sim} variant="contained" className="marginLeft" size='large' color="primary">
                  Sim
                </Button>
              </Box>
              <Box mx={2}>
                <Button onClick={nao} variant="contained" size='large' color="secondary">
                  Não
                </Button>
              </Box>
            </Box>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}
export default DeletarTema;