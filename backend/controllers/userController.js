/*
const { Member } = require('../models')
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const getMembers = async (req, res) =>{
    try {
        const allMembers = await sequelize.query(`
            SELECT
                m.MemberID,
                m.MemberName,
                m.MemberSurname,
                m.MemberAge,
                'student' as type
            FROM member m
            JOIN universitystudent s ON m.MemberID = s.MemberID
            
            UNION
            
            SELECT
                m.MemberID,
                m.MemberName,
                m.MemberSurname,
                m.MemberAge,
                'customer' as type
            FROM member m
            JOIN privatecustomer c ON m.MemberID = c.MemberID
            
            ORDER BY MemberName
        `, {
            type: QueryTypes.SELECT
        });

        res.status(200).json(allMembers);
    } catch (error) {
        console.error('Full error:', error);
        console.error('Error message:', error.message);
        console.error('SQL error:', error.original);
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
  try {
    const user = await Member.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

module.exports = { getMembers, getUserById }
 */