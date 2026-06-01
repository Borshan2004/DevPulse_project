
import { pool } from "../../db";

const createIssues_DB = async (payload: { title: string, description: string, type: string, userid: number }) => {


    const { title, description, type, userid } = payload;



    const result = await pool.query(`
        INSERT INTO issues(title,description,type,reporter_id) VALUES($1,$2,$3,$4) RETURNING*
        `, [title, description, type, userid])

    return result
}

const getAllIssues_DB = async (query: { sort?: string, type?: string, status?: string }) => {


    const {
        sort = "newest",
        type,
        status
    } = query;

    let basequery = `SELECT * FROM issues WHERE 1=1 `;

    const values = [];

    if (type) {
        values.push(type);

        basequery += `AND type=$${values.length}`
    }

    if (status) {
        values.push(status);

        basequery += `AND status=$${values.length}`
    }

    basequery += sort === "newest" ? ` ORDER BY created_at DESC` : ` ORDER BY created_at ASC`


    const issues_result = await pool.query(basequery, values);


    const issues_row = issues_result.rows;

    const issues_repoter_id = issues_row.map((id_issue) => id_issue.reporter_id)


    const users_result = await pool.query(
        `SELECT id,name,role FROM users WHERE id = ANY($1)`, [issues_repoter_id]
    )

    const repoters_info: { [key: number]: any } = {};

    users_result.rows.forEach((user) => {
        repoters_info[user.id] = user

    })

    const final_result = issues_row.map((issue_data) => ({
        id: issue_data.id,
        title: issue_data.title,
        description: issue_data.description,
        type: issue_data.type,
        status: issue_data.status,
        reporter: repoters_info[issue_data.reporter_id],
        updated_at: issue_data.updated_at,
        created_at: issue_data.created_at,

    }));

    return final_result;

}


const getIssueById_DB = async (id: string) => {

    const issues_result = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

    const issues_row = issues_result.rows[0];


    const users_result = await pool.query(
        `SELECT id,name,role FROM users WHERE id = $1`, [issues_row.reporter_id]
    )

    const user_data = users_result.rows[0];


    const final_result = {
        id: issues_row.id,
        title: issues_row.title,
        description: issues_row.description,
        type: issues_row.type,
        status: issues_row.status,
        reporter: {
            id: user_data.id,
            name: user_data.name,
            role: user_data.role
        },
        updated_at: issues_row.updated_at,
        created_at: issues_row.created_at,

    };

    return final_result;



}

const updateIssueById_DB = async (id: string, payload: { title: string, description: string, type: string }) => {

    const { title, description, type } = payload;

    const result = await pool.query(`
        UPDATE issues SET title=COALESCE($1,title), description=COALESCE($2,description), type=COALESCE($3,type) WHERE id=$4 RETURNING*`, [title, description, type, id])

    return result.rows[0];
}



const deleteIssueById_DB = async (id: string) => {

    const result = await pool.query(`DELETE FROM issues WHERE id=$1`, [id])

    return result;

}

export const issuesService = {
    createIssues_DB,
    getAllIssues_DB,
    getIssueById_DB,
    updateIssueById_DB,
    deleteIssueById_DB
}