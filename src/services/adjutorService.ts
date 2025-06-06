import axios from 'axios';
import config from '../config';
import logger from '../utils/logger';

class AdjutorService {
    async checkBlacklist(identity: string): Promise<boolean> {
        try {
            const response = await axios.get(`${config.ADJUTOR_BASE_URL}/v2/verification/karma/${encodeURIComponent(identity)}`, {
                headers: {
                    Authorization: `Bearer ${config.ADJUTOR_API_KEY}`
                }
            });

            const { karma_identity } = response.data;

            return Boolean(karma_identity);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return false;
            }

            logger.error('Adjutor Karma service error fkdjskf', error);
            return false;
        }
    }
}

export default new AdjutorService();
