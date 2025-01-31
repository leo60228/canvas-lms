/*
 * Copyright (C) 2018 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import I18n from 'i18n!IndividiualStudentMasteryAssignmentResult'
import _ from 'lodash'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import View from '@instructure/ui-layout/lib/components/View'
import Button from '@instructure/ui-buttons/lib/components/Button'
import Text from '@instructure/ui-elements/lib/components/Text'
import IconAssignment from '@instructure/ui-icons/lib/Line/IconAssignment'
import IconQuiz from '@instructure/ui-icons/lib/Line/IconQuiz'
import IconHighlighter from '@instructure/ui-icons/lib/Line/IconHighlighter'
import * as shapes from './shapes'
import Ratings from '../../rubrics/Ratings'

const scoreFromPercent = (percent, outcome) => {
  if (outcome.points_possible > 0) {
    return +(percent * outcome.points_possible).toFixed(2)
  }
  else {
    return +(percent * outcome.mastery_points).toFixed(2)
  }
}

const renderLinkedResult = (name, url, isQuiz) => (
  <Button
    variant="link"
    href={url}
    theme={{mediumPadding: '0', mediumHeight: 'normal', fontWeight: '700'}}
    icon={isQuiz ? IconQuiz : IconAssignment}
  >
    {name}
  </Button>
)

const renderUnlinkedResult = (name) => (
  <Flex alignItems="center">
    <FlexItem><Text size="medium">
      <IconHighlighter />
    </Text></FlexItem>
    <FlexItem padding="0 x-small"><Text weight="bold">{ name }</Text></FlexItem>
  </Flex>
)

const AssignmentResult = ({ outcome, result, outcomeProficiency }) => {
  const { ratings } = outcome
  const { html_url: url, name, submission_types: types } = result.assignment
  const isQuiz = types && types.indexOf('online_quiz') >= 0
  const score = result.percent ? scoreFromPercent(result.percent, outcome) : result.score
  return (
    <Flex padding="small" direction="column" alignItems="stretch">
      <FlexItem>
        { url.length > 0 ? renderLinkedResult(name, url, isQuiz) : renderUnlinkedResult(name) }
      </FlexItem>
      <FlexItem padding="x-small 0">
        <View padding="x-small 0 0 0">
          <Text size="small" fontStyle="italic" weight="bold">{
            result.hide_points ? I18n.t('Your score') : I18n.t('Your score: %{score}', { score })
          }</Text>
        </View>
      </FlexItem>
      <FlexItem borderWidth="small">
        <div className="react-rubric">
          <div className="ratings">
            <Ratings
              tiers={ratings}
              points={score}
              hidePoints={result.hide_points}
              useRange={false}
              customRatings={_.get(outcomeProficiency, 'ratings')}
              defaultMasteryThreshold={outcome.mastery_points}
              pointsPossible={outcome.points_possible}
              assessing={false}
              isSummary={false}
            />
          </div>
        </div>
      </FlexItem>
    </Flex>
  )
}

AssignmentResult.propTypes = {
  result: shapes.outcomeResultShape.isRequired,
  outcome: shapes.outcomeShape.isRequired,
  outcomeProficiency: shapes.outcomeProficiencyShape
}

AssignmentResult.defaultProps = {
  outcomeProficiency: null
}

export default AssignmentResult
