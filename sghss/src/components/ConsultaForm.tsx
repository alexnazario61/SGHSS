import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  paciente: yup.string().required('Paciente é obrigatório'),
  medico: yup.string().required('Médico é obrigatório'),
  data: yup.string().required('Data é obrigatória'),
  hora: yup.string().required('Hora é obrigatória'),
  tipo: yup.string().required('Tipo é obrigatório'),
});

interface ConsultaFormProps {
  open: boolean;
  onClose: () => void;
}

const ConsultaForm: React.FC<ConsultaFormProps> = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      paciente: '',
      medico: '',
      data: '',
      hora: '',
      tipo: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onClose();
    },
  });

  return (
    <Dialog data-testid="consulta-form" open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Nova Consulta</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Paciente</InputLabel>
                <Select
                  name="paciente"
                  value={formik.values.paciente}
                  onChange={formik.handleChange}
                  error={formik.touched.paciente && Boolean(formik.errors.paciente)}
                  label="Paciente"
                >
                  <MenuItem value="João Silva">João Silva</MenuItem>
                  <MenuItem value="Maria Santos">Maria Santos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Médico</InputLabel>
                <Select
                  name="medico"
                  value={formik.values.medico}
                  onChange={formik.handleChange}
                  error={formik.touched.medico && Boolean(formik.errors.medico)}
                  label="Médico"
                >
                  <MenuItem value="Dr. Paulo Santos">Dr. Paulo Santos</MenuItem>
                  <MenuItem value="Dra. Ana Lima">Dra. Ana Lima</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                name="data"
                label="Data"
                value={formik.values.data}
                onChange={formik.handleChange}
                error={formik.touched.data && Boolean(formik.errors.data)}
                helperText={formik.touched.data && formik.errors.data}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                name="hora"
                label="Hora"
                value={formik.values.hora}
                onChange={formik.handleChange}
                error={formik.touched.hora && Boolean(formik.errors.hora)}
                helperText={formik.touched.hora && formik.errors.hora}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Consulta</InputLabel>
                <Select
                  name="tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                  label="Tipo de Consulta"
                >
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Telemedicina">Telemedicina</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Agendar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ConsultaForm;
