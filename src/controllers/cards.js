import Card from '../models/card'

export default class CardsController {
    static async index(request, response) {
        response.json(await Card.getAll() || []);
    }

    static async create(request, response) {
        if (Card.create(request.body.question, request.body.answer))
            response.json({});
        else
            response.status(500).json({});
    }

    static async update(request, response) {
        if (Card.update(request.body.id, request.body.question, request.body.answer))
            response.json({});
        else
            response.status(500).json({});
    }

    static async destroy(request, response) {
        if (Card.destroy(request.body.id))
            response.json({});
        else
            response.status(500).json({});
    }
}