import styled from 'styled-components';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

/** App Theme */
import { colors } from '../../Themes/Colors';

const FormWrapper = styled(Form)`
  max-width: 350px;
  border: 1px solid ${colors.grey};
  margin: 7% auto !important;
  padding: 42px 24px 50px !important;
  background: ${colors.white};
`;

export default FormWrapper;
