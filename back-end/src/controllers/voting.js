const {
  getVotings,
  createVoting,
  getVotingById,
  deleteVotingById,
  createVotingVariant,
  deleteVotingVariant,
  updateVotingVariant,
  startVoting,
  finishVoting,
  createMember,
  acceptMember,
  declineMember,
  vote,
  updateVoting
} = require('../services/voting');

module.exports = {
  async getVotings(req, res, next) {
    try {
      const { userId, query: { my } } = req;
      const votings = await getVotings(userId, my);
      res.status(200).send(votings);
    } catch (error) {
      next(error);
    }
  },
  async getVotingById(req, res, next) {
    try {
      const { params: { id } } = req;
      const voting = await getVotingById(id);
      res.status(200).send(voting);
    } catch (error) {
      next(error);
    }
  },
  async createVoting(req, res, next) {
    try {
      const { userId, body } = req;
      const voting = await createVoting(userId, body);
      res.status(200).send(voting);
    } catch (error) {
      next(error);
    }
  },
  async deleteVotingById(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await deleteVotingById(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async updateVoting(req, res, next) {
    try {
      const { userId, params: { id }, body } = req;
      const result = await updateVoting(userId, id, body);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async createVotingVariant(req, res, next) {
    try {
      const { userId, body } = req;
      const result = await createVotingVariant(userId, body);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async deleteVotingVariant(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await deleteVotingVariant(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async updateVotingVariant(req, res, next) {
    try {
      const { userId, body, params: { id } } = req;
      const result = await updateVotingVariant(userId, id, body);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async startVoting(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await startVoting(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async finishVoting(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await finishVoting(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async createMember(req, res, next) {
    try {
      const { userId, body: { votingId, userPublicKey } } = req;
      const data = await createMember(userId, votingId, userPublicKey);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  },
  async acceptMember(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await acceptMember(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async declineMember(req, res, next) {
    try {
      const { userId, params: { id } } = req;
      const result = await declineMember(userId, id);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
  async vote(req, res, next) {
    try {
      const { userId, body: { votingId, variantId, transactionHash } } = req;
      const result = await vote(userId, votingId, variantId, transactionHash);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
};
