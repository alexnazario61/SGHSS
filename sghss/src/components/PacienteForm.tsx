import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControlLabel, Checkbox, Typography, FormControl, FormLabel, FormGroup } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  telefone: yup.string().required('Telefone é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  termoPrivacidade: yup.boolean()
    .oneOf([true], 'É necessário aceitar os termos de privacidade'),
  autorizaCompartilhamento: yup.boolean()
    .required('É necessário definir a autorização de compartilhamento'),
  dadosSensiveis: yup.array()
    .min(1, 'Selecione pelo menos um tipo de dado sensível'),
});

interface PacienteFormProps {
  open: boolean;
  onClose: () => void;
}

const PacienteForm = ({ open, onClose }: PacienteFormProps) => {
  const formik = useFormik({
    initialValues: {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      termoPrivacidade: false,
      autorizaCompartilhamento: false,
      dadosSensiveis: [],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Novo Paciente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="nome"
                label="Nome Completo"
                value={formik.values.nome}
                onChange={formik.handleChange}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="cpf"
                label="CPF"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="telefone"
                label="Telefone"
                value={formik.values.telefone}
                onChange={formik.handleChange}
                error={formik.touched.telefone && Boolean(formik.errors.telefone)}
                helperText={formik.touched.telefone && formik.errors.telefone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="termoPrivacidade"
                    checked={formik.values.termoPrivacidade}
                    onChange={formik.handleChange}
                  />
                }
                label="Li e aceito a Política de Privacidade e LGPD"
              />
              <Typography variant="caption" color="error">
                {formik.touched.termoPrivacidade && formik.errors.termoPrivacidade}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Autorização de Dados Sensíveis</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="dadosSensiveis" value="historico_medico" />}
                    label="Histórico Médico"
                  />
                  <FormControlLabel
                    control={<Checkbox name="dadosSensiveis" value="exames" />}
                    label="Resultados de Exames"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PacienteForm;
