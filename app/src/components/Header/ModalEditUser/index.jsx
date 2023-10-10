import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import './style.css';
import { useState, useContext } from 'react';
import header_home_context from '../../../context/context';
import EditLoading from './Loading';
import { UserContext } from '../../../context/dashboard_context';
import { formatCpf } from '../../../utils/userData';
import  InputMask from "react-input-mask"
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { reactQueryHooks } from '../../../services/reactquery';
import { UsersServices } from '../../../api/UsersServices';


const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  borderRadius: '30px',
  gap: 0.8,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  border: 'none',
  p: 4,
  zIndex: 4
};

const buttonStyle = {
  marginTop: "1rem",
  cursor: "pointer",
  position: "relative",
  backgroundColor: "var(--principais-rosa-normal)",
  borderRadius: "0.8rem",
  boxShadow: "rgb(121, 18, 111) 0px 4px 0px 0px",
  padding: "1.3rem",
  backgroundRepeat: "no-repeat",
  boxSizing: "border-box",
  width: "9rem",
  height: "1.5rem",
  color: "#fff",
  border: "none",
  fontSize: "0.8rem",
  opacity: '0.9',
  transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
  overflow: "hidden",
  '&::before': {
    content: "''",
    position: "absolute",
    inset: "0",
    margin: "auto",
    width: "6rem",
    height: "6rem",
    scale: "0",
    zIndex: -1,
    backgroundColor: '#008000',
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.320, 1)"
  },
  '&:hover::before': {
    scale: '3'
  },

  '&:hover': {
    backgroundColor: '#008000',
    scale: '1.1',
    opacity: '1',
    boxShadow: "rgb(0, 51, 0) 0px 4px 0px 0px",
  },
  '&:active': {
    scale: '1',
  },
}

export default function ModalEditUser() {
  const date = useContext(header_home_context);
  const [hasChange, setHasChange] = useState(false);
  const [error, setError] = useState('');
  const [sucess, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const { setOpenSuccessMessage, setSuccessMessageContent } = useContext(UserContext);
  const [openLoading, setOpenLoading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation(data => UsersServices.editUser(data, reactQueryHooks.apiHeaders()), {
    onSuccess: () => queryClient.invalidateQueries(['user'])
});

  const userQuery = reactQueryHooks.getUserData();
  if (userQuery.isLoading) return;
  if (userQuery.isError) return;

  const {name, email, cpf, phone, id} = userQuery.data.data.user;

  const [form, setForm] = useState({
    name,
    email,
    cpf,
    phone,
    password: '',
    confirmPassword:'',
    id
  });

  const handleCloseLoading = () => {
    setOpenLoading(false);
  };

  const handleOpenLoading = () => {
    setOpenLoading(true);
  };

  function handleOnChange(e) {
    setHasChange(true);
    const { name, value, style } = e.target;
    style.border = '1px solid rgba(208, 213, 221, 1)';
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formatedCpf = form.cpf ? formatCpf(form.cpf) : '';

    const inputs = document.querySelectorAll('input');

    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      if (input.name === 'name' || input.name === 'email') {
        if (!form.name || !form.email) {
          input.style.border = '1px solid red'
          setError('Preencha os campos obrigatórios')
        }
      }
      if (input.name === 'cpf') {
        if (form.cpf !== '' && formatedCpf.length !== 11) {
          input.style.border = '1px solid red';
          setError('Insira um cpf válido')
        }
      }
      if (input.name === 'password' || input.name === 'confirmPassword') {
        if (form.password !== form.confirmPassword) {
          input.style.border = '1px solid red';
          setError('As senhas não coincidem')
        }
      }
      if (form.name !== '' && form.email !== '') {
        if (form.password === form.confirmPassword) {
          try {
            const response = await mutation.mutateAsync({...form, cpf: formatedCpf});
            handleOnClose()
            setError('');
            setOpenSuccessMessage(true)
            return setSuccessMessageContent('Usuário atualizado com sucesso!')

          } catch (error) {
            if (error.response.status === 400) {
              if (error.response.data.includes('email')) {
                inputs[1].style.border = '1px solid red'
                setError(error.response.data)
                return
              }
              if (error.response.data.includes('cpf')) {
                inputs[2].style.border = '1px solid red'
                setError(error.response.data)
                return
              }
            }
          }

        }
      }

    }
  }
  const handleOnClose = () => {
    date.setModalOpen(false);
    setError('');
    setSuccess('');
  }

  return (
    <div>
      <EditLoading
        handleOpenLoading={handleOpenLoading}
        handleCloseLoading={handleCloseLoading}
        openLoading={openLoading}
      />
      <Modal
        sx={{ border: 'none' }}
        open={date.isModalOpen}
        onClose={handleOnClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon onClick={handleOnClose} className='close-icon-edit' />
          <h2 className='edit-user-title'>Edite seu cadastro</h2>
          <div className='edit-user-div-input'>
            <label htmlFor="name"> Nome* </label>
            <input type="text" placeholder='Digite seu nome'
              value={form.name ?? ''}
              onChange={handleOnChange}
              name='name'
            />
          </div>
          <div className='edit-user-div-input'>
            <label htmlFor="email"> E-mail* </label>
            <input type="email" placeholder='Digite seu email'
              value={form.email ?? ''}
              onChange={handleOnChange}
              name='email'
            />
          </div>
          <div className='edit-user-div-cpf-tel'>
            <div className='edit-user-div-cpf'>
              <label htmlFor="cpf"> CPF 
              </label>
              <InputMask
              mask='999.999.999-99' 
              name='cpf'
              value={form.cpf ?? ''} 
              onChange={handleOnChange}
              placeholder='..-'
              />
            </div>
            <div className='edit-user-div-tel'>
              <label htmlFor="phone"> Telefone 
              </label>
              <InputMask 
              value={form.phone ?? ''}
              onChange={handleOnChange}
              name='phone'
              mask='+55 (99) 99999-9999' 
              placeholder='+55 (    ) __-__'
              />
            </div>
          </div>
          <div className='edit-user-div-input'>
            <label htmlFor="password"> Nova senha* </label>
            <input type={showPass ? 'text' : 'password'} placeholder='*******'
              value={form.password ?? ''}
              onChange={handleOnChange}
              name='password'
            />
            <img onClick={() => setShowPass(!showPass)} className='eye-edit-image' src={showPass ? "/eye-open-pass.png" : "/eye-close-pass.png"} alt="eye" />
          </div>
          <div className='edit-user-div-input'>
            <label htmlFor="confirmPassword"> Confirmar Senha* </label>
            <input type={showConfirmPass ? 'text' : 'password'} placeholder='*******'
              value={form.confirmPassword ?? ''}
              onChange={handleOnChange}
              name='confirmPassword'
            />
            <img onClick={() => setShowConfirmPass(!showConfirmPass)} className='eye-edit-image' src={showConfirmPass ? "/eye-open-pass.png" : "/eye-close-pass.png"} alt="eye" />
          </div>
          {error ?
            <span className='modal-error-message'>
              {error}
            </span> : <span className='modal-edit-sucess'> {sucess}</span>
          }
          <Button variant='none' color='sucess' sx={buttonStyle}
            onClick={handleSubmit} className='button-edit-modal'>Aplicar</Button>
        </Box>
      </Modal>
    </div>
  );
}