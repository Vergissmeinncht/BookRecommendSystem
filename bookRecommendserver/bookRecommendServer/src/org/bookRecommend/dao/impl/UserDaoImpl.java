package org.bookRecommend.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bookRecommend.dao.UserDao;
import org.bookRecommend.entities.AdminMessage;
import org.bookRecommend.entities.GPTRecommendResult;
import org.bookRecommend.entities.User;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Repository;

/**
 * 用户相关数据访问实现类
 */
@Repository
public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {

	@SuppressWarnings("unchecked")
	@Override
	public User selectUserByName(String username) {
		ArrayList<User> users = (ArrayList<User>) this.getSqlSession()
				.selectList(USER_NAMESPACE + "selectUserByName", username);
		if (users.size() < 1) {
			return null;
		} else {
			return users.get(0);
		}
	}

	@Override
	public void insertUser(User user) {
		this.getSqlSession().insert(USER_NAMESPACE + "insertUser", user);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<User> selectAllUser() {
		return this.getSqlSession().selectList(USER_NAMESPACE + "selectAllUser");
	}

	@Override
	public void deleteUser(Integer userId) {
		this.getSqlSession().delete(USER_NAMESPACE + "deleteUserById", userId);		
	}

	@Override
	public List<User> selectUserByUserNameLike(String username) {
		Map<String , Object> queryMap = new HashMap<>();
		queryMap.put("username", username);
		@SuppressWarnings("unchecked")
		ArrayList<User> users = (ArrayList<User>) this.getSqlSession()
				.selectList(USER_NAMESPACE + "selectUserByUserNameLike", queryMap);
		return users;
	}

	@Override
	public void updateUser(User user) {
		this.getSqlSession().update(USER_NAMESPACE + "updateUser", user);
	}

	@Override
	public User selectUserById(Integer id) {
		return (User) this.getSqlSession().selectOne(USER_NAMESPACE + "selectUserById", id);
	}

	@Override
	public Integer selectUserCount() {
		return (Integer) this.getSqlSession().selectOne(USER_NAMESPACE + "selectUserCount");
	}

	@Override
	public void addBookRecommend(Integer userId, Integer bookId) {
		GPTRecommendResult recommend = new GPTRecommendResult();
		recommend.setUserId(userId);
		recommend.setBookId(bookId);
		this.getSqlSession().insert(USER_NAMESPACE + "insertGPTRecommendResult",recommend);
	}

	@Override
	public ArrayList<GPTRecommendResult> selectBookByUserId(Integer userId) {
		@SuppressWarnings("unchecked")
		ArrayList<GPTRecommendResult> ans = (ArrayList<GPTRecommendResult>) this.getSqlSession().selectList(USER_NAMESPACE + "selectGPTRecommendResult",userId);
		return ans;
	}

	@Override
	public void deleteRecommend(Integer recommendId) {
		System.out.println(recommendId);
		this.getSqlSession().delete(USER_NAMESPACE + "deleteAIRecommend",recommendId);
	}

	@Override
	public ArrayList<GPTRecommendResult> getRecommendIdByIds(Integer userId, Integer bookId) {
		Map<String,Object> map = new HashMap<>();
		map.put("userId",userId);
		map.put("bookId",bookId);
		ArrayList<GPTRecommendResult> ans = (ArrayList<GPTRecommendResult>) this.getSqlSession().selectList(USER_NAMESPACE + "selectRecommendByIds",map);
		return ans;
	}


}
