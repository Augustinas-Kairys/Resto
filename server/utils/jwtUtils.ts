import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, 'gp_1QMvn-61XxRuhwub8_5LF9F28FhtQ9Cb9CJitN9It9g_vlSCa1UvPkRRFfT2i', { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, 'gp_1QMvn-61XxRuhwub8_5LF9F28FhtQ9Cb9CJitN9It9g_vlSCa1UvPkRRFfT2i');
};



export default { generateToken, verifyToken };
