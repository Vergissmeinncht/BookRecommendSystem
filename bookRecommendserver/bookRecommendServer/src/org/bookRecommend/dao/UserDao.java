package org.bookRecommend.dao;

import java.util.ArrayList;
import java.util.List;

import org.bookRecommend.entities.AdminMessage;
import org.bookRecommend.entities.GPTRecommendResult;
import org.bookRecommend.entities.User;

/**
 * 用户相关数据访问接口层
 */
public interface UserDao {

	public static final String USER_NAMESPACE = "org.bookRecommend.mapper.UserMapper.";
	public static final String RECOMMEND_NAMESPACE = "org.bookRecommend.mapper.GPTRecommendResultMapper.";
	
	/**
	 * 通过用户名获取用户实体类
	 * @param username 用户名
	 * @return user 用户实体类
	 */
	public User selectUserByName(String username);
	
	/**
	 * 查询所有用户实体类
	 * @return users 用户实体类集合
	 */
	public List<User> selectAllUser();
	
	/**
	 * 插入一个新用户
	 * @param user 用户实体类
	 */
	public void insertUser(User user);
	
	/**
	 * 根据id删除一个用户
	 * @param userId 用户id
	 */
	public void deleteUser(Integer userId);
	
	/**
	 * 通过用户名模糊查询用户实体类
	 * @param username 用户名
	 * @return user 用户实体类集合
	 */
	public List<User> selectUserByUserNameLike(String username);
	
	/**
	 * 修改用户信息
	 * @param user 用户实体类
	 */
	public void updateUser(User user);
	
	/**
	 * 通过id查找对应用户实体类
	 * @param id 用户id
	 * @return user 用户实体类
	 */
	public User selectUserById(Integer id);
	
	/**
	 * 查找用户数量
	 * @return
	 */
	public Integer selectUserCount();

	void addBookRecommend(Integer userId, Integer bookId);

	ArrayList<GPTRecommendResult> selectBookByUserId(Integer userId);

    void deleteRecommend(Integer recommendId);

	ArrayList<GPTRecommendResult> getRecommendIdByIds(Integer userId, Integer bookId);
}
