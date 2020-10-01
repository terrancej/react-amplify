import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Spin, Input, Button, notification, Col, Row } from 'antd';

/** Presentational */
import FormWrapper from '../../Components/Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

/** App constants */
import { AUTH_USER_TOKEN_KEY } from '../../Utils/constants';

type Props = RouteComponentProps & {
  form: any;
};

type State = {
  loading: boolean;
};

class LoginContainer extends React.Component<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFields(async (err: Error, values: { username: string; password: string }) => {
      if (!err) {
        let { username, password } = values;

        this.setState({ loading: true });

        try {
          const user = await Auth.signIn(username, password);

          const { history } = this.props;

          // MFA specific resources:
          //
          // - https://aws.amazon.com/premiumsupport/knowledge-center/sns-sms-spending-limit-increase/
          // - https://docs.amplify.aws/lib/auth/mfa/q/platform/js#sign-in-with-custom-auth-challenges
          // - https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html
          if (user.challengeName === 'SMS_MFA') {
            return console.log('Needs SMS_MFA');
          }
          console.log(user)
          localStorage.setItem(AUTH_USER_TOKEN_KEY, user.signInUserSession.accessToken.jwtToken);

          notification.success({
            message: 'Succesfully logged in!',
            description: 'Logged in successfully, Redirecting you in a few!',
            placement: 'topRight',
            duration: 1.5
          });

          return history.push('/dashboard');
        } catch (error) {
          notification.error({
            message: 'Error',
            description: error.message,
            placement: 'topRight'
          });

          console.log(error);

          this.setState({ loading: false });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;

    return (
      <React.Fragment>
        <FormWrapper onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]
            })(
              <Input prefix={<UserOutlined style={{ color: colors.transparentBlack }} />} placeholder="Username" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]
            })(
              <Input
                prefix={<LockOutlined style={{ color: colors.transparentBlack }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item className="text-center">
            <Row gutter={16}>
              <Col lg={24}>
                <Link style={{ float: 'right' }} className="login-form-forgot" to="/forgot-password">
                  Forgot password
                </Link>
              </Col>
              <Col lg={24}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  disabled={loading}
                  htmlType="submit"
                  className="login-form-button"
                >
                  {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : 'Log in'}
                </Button>
              </Col>
              <Col lg={24}>
                Or <Link to="/signup">register now!</Link>
              </Col>
            </Row>
          </Form.Item>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default Form.create()(LoginContainer);
